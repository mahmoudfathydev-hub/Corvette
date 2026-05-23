"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 60, filter: "blur(10px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.8, ease: "easeOut" },
};


export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="z-10 text-center px-4">
        <motion.h1
          {...fadeInUp}
          className="text-5xl md:text-8xl font-thin tracking-[0.3em] uppercase mb-4"
        >
          Engineered in <span className="text-accent font-normal text-glow-red">Shadows</span>
        </motion.h1>
        <motion.p
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.5em] text-zinc-500 uppercase"
        >
          The Future of Motion
        </motion.p>
      </div>
    </section>
  );
}

export function PerformanceSection() {
  return (
    <section id="performance" className="relative h-screen w-full flex items-center justify-end px-6 md:px-24">
      <div className="max-w-md space-y-12">
        <motion.div {...fadeInUp} className="space-y-2">
          <div className="text-accent font-mono text-sm tracking-widest uppercase">Performance</div>
          <h2 className="text-4xl md:text-6xl font-light uppercase tracking-tighter">Power Redefined</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-8">
          {[
            { label: "Horsepower", value: "670", unit: "HP" },
            { label: "0-60 MPH", value: "2.6", unit: "SEC" },
            { label: "Top Speed", value: "195", unit: "MPH" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="glass p-6 group hover:glass-red transition-all duration-500"
            >
              <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mb-2">{stat.label}</div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-light tabular-nums">{stat.value}</span>
                <span className="text-accent text-sm font-mono">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InteriorSection() {
  return (
    <section id="interior" className="relative h-screen w-full flex items-center justify-start px-6 md:px-24">
      <div className="max-w-lg">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl md:text-7xl font-light uppercase tracking-tighter mb-8 leading-none">
            Visceral <br />
            <span className="text-zinc-600">Precision</span>
          </h2>
          <p className="text-zinc-400 font-light leading-relaxed mb-8">
            Every curve, every stitch, and every surface is designed with a single purpose: to connect the driver to the machine. A cockpit crafted for the elite.
          </p>
          <div className="h-[1px] w-24 bg-accent shadow-red mb-12" />
          
          <div className="flex gap-12">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Material</div>
              <div className="text-sm uppercase tracking-widest">Carbon Fiber</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Seating</div>
              <div className="text-sm uppercase tracking-widest">Nappa Leather</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function TechnologySection() {
  return (
    <section id="technology" className="relative h-screen w-full flex items-center justify-center">
      <div className="absolute inset-0 mask-radial opacity-20 bg-[linear-gradient(to_right,#8b0000_1px,transparent_1px),linear-gradient(to_bottom,#8b0000_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      <div className="z-10 text-center max-w-2xl px-6">
        <motion.div {...fadeInUp}>
          <h2 className="text-4xl md:text-6xl font-thin tracking-widest uppercase mb-12">Digital Intelligence</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Radar", "Vision", "Control", "Sync"].map((item, i) => (
              <div key={item} className="glass py-8 flex flex-col items-center justify-center gap-4 group cursor-crosshair">
                <div className="h-2 w-2 rounded-full bg-accent group-hover:animate-ping" />
                <span className="text-[10px] tracking-[0.4em] uppercase text-zinc-500">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function FinalCTASection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="space-y-12"
      >
        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tight leading-none italic">
          Dominate <br />
          <span className="text-accent underline decoration-1 underline-offset-8">Legacy</span>
        </h2>
        
        <button className="group relative px-12 py-4 overflow-hidden border border-accent bg-transparent transition-all duration-700 hover:bg-accent">
          <span className="relative z-10 text-xs font-bold tracking-[0.5em] uppercase transition-colors duration-700 group-hover:text-black">
            Reserve Your Prototype
          </span>
          <div className="absolute inset-0 translate-y-[100%] bg-accent transition-transform duration-700 group-hover:translate-y-0" />
        </button>
      </motion.div>
      
      <footer className="absolute bottom-12 text-[10px] text-zinc-700 uppercase tracking-widest">
        © 2026 Corvette Racing • Automotive CGI Showcase
      </footer>
    </section>
  );
}
