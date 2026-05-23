"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "Performance", href: "#performance" },
  { name: "Interior", href: "#interior" },
  { name: "Technology", href: "#technology" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-500 md:px-12",
        scrolled ? "glass py-3" : "bg-transparent"
      )}
    >
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 bg-accent shadow-red" />
        <span className="text-xl font-light tracking-[0.2em] uppercase">
          Corvette
        </span>
      </div>

      <div className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-xs font-light tracking-widest text-zinc-400 uppercase transition-colors hover:text-white"
          >
            {link.name}
          </a>
        ))}
        <button className="rounded-none border border-zinc-800 bg-white px-6 py-2 text-[10px] font-medium tracking-[0.2em] text-black uppercase transition-all hover:bg-accent hover:text-white hover:border-accent">
          Buy Now
        </button>
      </div>

      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 flex flex-col gap-4 bg-black/95 p-6 backdrop-blur-xl md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-light tracking-widest text-zinc-400 uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button className="mt-4 border border-zinc-800 bg-white py-3 text-xs font-semibold text-black uppercase">
              Buy Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
