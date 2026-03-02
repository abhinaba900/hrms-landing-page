"use client";
import { useEffect, useState } from "react";

export default function ScrollProgressButton() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      setIsTop(scrollTop <= 10);

      const total = scrollHeight - clientHeight;
      const progress = (scrollTop / total) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    // 1. Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 2. Smoothly animate progress → 0
    let current = scrollProgress;

    const interval = setInterval(() => {
      current -= 3; // speed of emptying
      if (current <= 0) {
        current = 0;
        clearInterval(interval);
      }
      setScrollProgress(current);
    }, 10); // smoother animation
  };

  return (
    <button
      onClick={handleClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center 
        w-14 h-14 rounded-full transition-all duration-300
        ${isTop ? "opacity-0 pointer-events-none scale-0" : "opacity-100 scale-100"}
      `}
    >
      <svg className="absolute inset-0" width="100%" height="100%">
        <circle
          cx="50%"
          cy="50%"
          r="22"
          stroke="#EEE"
          strokeWidth="4"
          fill="transparent"
        />

        <circle
          cx="50%"
          cy="50%"
          r="22"
          stroke="#000"
          strokeWidth="4"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={138}
          strokeDashoffset={138 - (138 * scrollProgress) / 100}
          style={{
            transition: "stroke-dashoffset 0.3s linear",
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
          }}
        />
      </svg>

      <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="3">
        <path d="M5 12 L10 7 L15 12" />
      </svg>
    </button>
  );
}
