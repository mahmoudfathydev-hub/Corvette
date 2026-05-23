/**
 * Batch convert PNG sequence frames to WebP for high performance.
 * Run: node scripts/convert-to-webp.mjs
 */
import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, basename, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, "..", "public", "sequence");
const OUTPUT_DIR = join(__dirname, "..", "public", "sequence-webp");
const QUALITY = 80;

async function convert() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = (await readdir(INPUT_DIR))
    .filter((f) => extname(f).toLowerCase() === ".png")
    .sort();

  console.log(`Converting ${files.length} PNGs to WebP (quality ${QUALITY})...`);

  let done = 0;
  const BATCH_SIZE = 8;

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (file) => {
        const input = join(INPUT_DIR, file);
        const output = join(OUTPUT_DIR, basename(file, ".png") + ".webp");
        await sharp(input).webp({ quality: QUALITY }).toFile(output);
        done++;
        process.stdout.write(`\r  ${done}/${files.length}`);
      })
    );
  }

  // Print size comparison
  const { statSync } = await import("fs");
  let pngTotal = 0, webpTotal = 0;
  for (const file of files) {
    pngTotal += statSync(join(INPUT_DIR, file)).size;
    webpTotal += statSync(join(OUTPUT_DIR, basename(file, ".png") + ".webp")).size;
  }

  console.log(`\n\nDone!`);
  console.log(`  PNG total:  ${(pngTotal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  WebP total: ${(webpTotal / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Saved:      ${((1 - webpTotal / pngTotal) * 100).toFixed(0)}%`);
}

convert().catch(console.error);
