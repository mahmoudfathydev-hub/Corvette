"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 128;
const PHASE1_COUNT = 15; // Critical first-viewport frames
const PHASE2_COUNT = 40; // Extended preload
const BATCH_SIZE = 8;

export default function ImageSequence() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES + 1).fill(null)
  );
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const framesRef = useRef<{ index: number }>({ index: 1 });
  const lastRenderedFrame = useRef<number>(-1);
  const loadedCountRef = useRef(0);
  const rafIdRef = useRef<number>(0);
  const supportsWebP = useRef(true);

  // Detect WebP support
  useEffect(() => {
    const webpTest = new Image();
    webpTest.onload = () => {
      supportsWebP.current = webpTest.width > 0;
    };
    webpTest.onerror = () => {
      supportsWebP.current = false;
    };
    webpTest.src =
      "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
  }, []);

  const getFramePath = useCallback((index: number) => {
    const paddedIndex = index.toString().padStart(3, "0");
    if (supportsWebP.current) {
      return `/sequence-webp/ezgif-frame-${paddedIndex}.webp`;
    }
    return `/sequence/ezgif-frame-${paddedIndex}.png`;
  }, []);

  // Find nearest loaded frame when target frame isn't available
  const findNearestFrame = useCallback((targetIndex: number): number => {
    const images = imagesRef.current;
    if (images[targetIndex]) return targetIndex;

    // Search outward from target in both directions
    for (let offset = 1; offset <= TOTAL_FRAMES; offset++) {
      const lower = targetIndex - offset;
      const higher = targetIndex + offset;
      if (lower >= 1 && images[lower]) return lower;
      if (higher <= TOTAL_FRAMES && images[higher]) return higher;
    }
    return 1;
  }, []);

  // Canvas render function — draws a single frame
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    const targetIndex = Math.min(
      TOTAL_FRAMES,
      Math.max(1, Math.round(framesRef.current.index))
    );
    const frameIndex = findNearestFrame(targetIndex);

    // Skip if we already rendered this exact frame
    if (frameIndex === lastRenderedFrame.current) return;

    const img = imagesRef.current[frameIndex];
    if (!img) return;

    // Use offscreen canvas for double-buffering
    let offscreen = offscreenCanvasRef.current;
    if (!offscreen) {
      offscreen = document.createElement("canvas");
      offscreenCanvasRef.current = offscreen;
    }
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;

    const offCtx = offscreen.getContext("2d", { alpha: false });
    if (!offCtx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    // Cover-fit the image
    const ratio = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;
    const x = (canvasWidth - newWidth) / 2;
    const y = (canvasHeight - newHeight) / 2;

    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = "high";
    offCtx.drawImage(img, x, y, newWidth, newHeight);

    // Swap: draw offscreen to main canvas
    context.drawImage(offscreen, 0, 0);
    lastRenderedFrame.current = frameIndex;
  }, [findNearestFrame]);

  // Image loading
  useEffect(() => {
    const loadImg = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve();
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.src = getFramePath(index);
        img.onload = () => {
          imagesRef.current[index] = img;
          loadedCountRef.current++;
          resolve();
        };
        img.onerror = () => {
          // If WebP fails, try PNG fallback
          if (supportsWebP.current) {
            const paddedIndex = index.toString().padStart(3, "0");
            img.src = `/sequence/ezgif-frame-${paddedIndex}.png`;
          } else {
            resolve();
          }
        };
      });
    };

    const preloadSequence = async () => {
      // Phase 1: Critical first frames (sequential for fastest first paint)
      for (let i = 1; i <= PHASE1_COUNT; i++) {
        await loadImg(i);
        setProgress(Math.round((i / PHASE2_COUNT) * 100));
      }

      // Phase 2: Extended preload in parallel batches
      for (let i = PHASE1_COUNT + 1; i <= PHASE2_COUNT; i += BATCH_SIZE) {
        const batch = [];
        for (let j = i; j < Math.min(i + BATCH_SIZE, PHASE2_COUNT + 1); j++) {
          batch.push(loadImg(j));
        }
        await Promise.all(batch);
        setProgress(
          Math.round(
            (Math.min(i + BATCH_SIZE, PHASE2_COUNT) / PHASE2_COUNT) * 100
          )
        );
      }

      setIsLoaded(true);

      // Phase 3: Background loading of remaining frames
      for (
        let i = PHASE2_COUNT + 1;
        i <= TOTAL_FRAMES;
        i += BATCH_SIZE
      ) {
        const batch = [];
        for (
          let j = i;
          j < Math.min(i + BATCH_SIZE, TOTAL_FRAMES + 1);
          j++
        ) {
          batch.push(loadImg(j));
        }
        await Promise.all(batch);
        // Small delay between batches to avoid network congestion
        await new Promise((r) => setTimeout(r, 50));
      }
    };

    preloadSequence();
  }, [getFramePath]);

  // 60fps render loop + GSAP ScrollTrigger
  useEffect(() => {
    if (!isLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      lastRenderedFrame.current = -1; // Force re-render
      renderFrame();
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // GSAP scroll animation
    const tl = gsap.to(framesRef.current, {
      index: TOTAL_FRAMES,
      ease: "none",
      scrollTrigger: {
        trigger: "#sequence-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15,
      },
    });

    // Dedicated 60fps render loop — independent of scroll events
    const tick = () => {
      renderFrame();
      rafIdRef.current = requestAnimationFrame(tick);
    };
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafIdRef.current);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isLoaded, renderFrame]);

  return (
    <div id="sequence-container" className="relative h-[700vh] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover"
          style={{
            filter: "contrast(1.05) saturate(1.1) brightness(0.95)",
            imageRendering: "auto",
          }}
        />

        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black transition-opacity duration-1000">
            <div className="mb-4 text-4xl font-light tracking-widest text-accent uppercase">
              Corvette
            </div>
            <div className="h-[1px] w-48 bg-zinc-800">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs font-mono text-zinc-500 uppercase">
              Initializing Engine {progress}%
            </div>
          </div>
        )}

        {/* Cinematic overlays */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-transparent opacity-50" />

        {/* Cinematic Grain Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <filter id="noiseFilter">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
        </div>

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
      </div>
    </div>
  );
}
