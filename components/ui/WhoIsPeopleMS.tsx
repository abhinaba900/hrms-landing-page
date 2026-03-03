"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ─── Data ──────────────────────────────────────────────────────────────── */
const BASE_AUDIENCES = [
  { label: "Startups", image: "/assets/who-is-people-ms.png" },
  {
    label: "Remote teams",
    image: "/assets/who-is-people-ms.png",
  },
  { label: "SMEs", image: "/assets/who-is-people-ms.png" },
  {
    label: "IT & software",
    image: "/assets/who-is-people-ms.png",
  },
  {
    label: "Manufacturing",
    image: "/assets/who-is-people-ms.png",
  },
];

/* ─── Constants ──────────────────────────────────────────────────────────── */
const ACTIVE_W = 340;
const INACTIVE_W = 260;
const GAP = 16;
const DUR = 450;

const EASE = `cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
const N = BASE_AUDIENCES.length;

/* ─── Unique ID Generator ────────────────────────────────────────────────── */
const genId = (prefix: string, index: number) =>
  `${prefix}-${index}-${Math.random().toString(36).substring(2, 9)}`;

/* ─── Build 3x cloned list [pre-clones, originals, post-clones] ────────── */
const ITEMS = [
  ...BASE_AUDIENCES.map((a, i) => ({ ...a, uid: genId("pre", i) })),
  ...BASE_AUDIENCES.map((a, i) => ({ ...a, uid: genId("real", i) })),
  ...BASE_AUDIENCES.map((a, i) => ({ ...a, uid: genId("post", i) })),
];

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function WhoIsPeopleMS() {
  const [activeIdx, setActiveIdx] = useState(N);
  const [skipAnim, setSkipAnim] = useState(false); // New state to prevent glitching on jump

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const hasMoved = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Centering math ──────────────────────────────────────────────────── */
  const getTranslateX = useCallback((index: number): number => {
    const containerW = containerRef.current?.clientWidth ?? 0;
    const leftOffset = index * (INACTIVE_W + GAP);
    const activeCardCenter = INACTIVE_W / 2 + (ACTIVE_W - INACTIVE_W) / 2;
    return containerW / 2 - leftOffset - activeCardCenter;
  }, []);

  /* ── Apply transform ─────────────────────────────────────────────────── */
  const applyTransform = useCallback(
    (index: number, animate: boolean) => {
      if (!trackRef.current) return;
      const tx = getTranslateX(index);
      trackRef.current.style.transition = animate
        ? `transform ${DUR}ms ${EASE}`
        : "none";
      trackRef.current.style.transform = `translateX(${tx}px)`;
    },
    [getTranslateX],
  );

  /* ── Go to a card ────────────────────────────────────────────────────── */
  const goTo = useCallback(
    (index: number, animate = true) => {
      setActiveIdx(index);
      applyTransform(index, animate);
    },
    [applyTransform],
  );

  /* ── Transition-end: silent jump for seamless loop ───────────────────── */
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // Ignore transition ends from the individual cards
      if (e.target !== trackRef.current) return;

      let nextIdx = activeIdx;
      if (activeIdx < N) {
        nextIdx = activeIdx + N;
      } else if (activeIdx >= 2 * N) {
        nextIdx = activeIdx - N;
      }

      // If a jump is needed
      if (nextIdx !== activeIdx) {
        setSkipAnim(true); // Disable card animations
        setActiveIdx(nextIdx);
        applyTransform(nextIdx, false); // Snap the track instantly
      }
    },
    [activeIdx, applyTransform],
  );

  /* ── Re-enable animations immediately after the jump ─────────────────── */
  useEffect(() => {
    if (skipAnim) {
      // Double requestAnimationFrame ensures the browser paints the "transition: none"
      // frame before we turn animations back on for the next slide.
      let raf1: number;
      let raf2: number;
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          setSkipAnim(false);
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
  }, [skipAnim]);

  /* ── Initial position + recalc on resize ────────────────────────────── */
  useEffect(() => {
    const recalc = () => applyTransform(activeIdx, false);
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Auto-play ───────────────────────────────────────────────────────── */
  const scheduleAutoPlay = useCallback(() => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    autoTimer.current = setTimeout(() => {
      setActiveIdx((prev) => {
        const next = prev + 1;
        applyTransform(next, true);
        return next;
      });
    }, 2000);
  }, [applyTransform]);

  useEffect(() => {
    scheduleAutoPlay();
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [activeIdx, scheduleAutoPlay]);

  /* ── Drag / Touch ────────────────────────────────────────────────────── */
  const onPointerDown = (clientX: number) => {
    isDragging.current = true;
    hasMoved.current = false;
    dragStartX.current = clientX;
    if (autoTimer.current) clearTimeout(autoTimer.current);
  };

  const onPointerMove = (clientX: number) => {
    if (!isDragging.current) return;
    if (Math.abs(clientX - dragStartX.current) > 5) hasMoved.current = true;
  };

  const onPointerUp = (clientX: number) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = clientX - dragStartX.current;
    if (Math.abs(delta) > 50) {
      const next = delta < 0 ? activeIdx + 1 : activeIdx - 1;
      goTo(next);
    }
    scheduleAutoPlay();
  };

  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <section className="py-24 pb-0 bg-[#FCFFF4] overflow-hidden who-is-peoplems-for-section">
      <div className="max-w-[1312px] mx-auto px-6 lg:px-16 mb-14">
        <div className="flex flex-col items-center text-center">
          <div className="relative inline-block">
            <img
              src="/assets/who-is-people-ms-for-heading-right-top-image.png"
              alt="Crown"
              className="absolute -top-10 -right-24 w-[100px] h-auto pointer-events-none"
            />
            <h2 className="text-[52px] who-is-peoplems-title-size spradesheet-usage-text-in-inventory-management leading-[62.4px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px]">
              Who is PeopleMS for?
            </h2>
          </div>
          <p className="text-[18px] who-is-peoplems-subtext font-['Sequel_Sans'] font-normal text-brand-dark mt-4 max-w-[560px] ">
            Designed to adapt across industries, team sizes, and work models.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[420px] overflow-hidden"
        style={{ cursor: isDragging.current ? "grabbing" : "grab" }}
        onMouseDown={(e) => onPointerDown(e.clientX)}
        onMouseMove={(e) => onPointerMove(e.clientX)}
        onMouseUp={(e) => onPointerUp(e.clientX)}
        onMouseLeave={(e) => {
          if (isDragging.current) onPointerUp(e.clientX);
        }}
        onTouchStart={(e) => onPointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => onPointerMove(e.touches[0].clientX)}
        onTouchEnd={(e) => onPointerUp(e.changedTouches[0].clientX)}
      >
        <div
          ref={trackRef}
          className="flex items-start will-change-transform"
          style={{ gap: `${GAP}px` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {ITEMS.map((item, index) => {
            const isActive = index === activeIdx;

            // Switch transitions to "none" when skipAnim is true so resizing doesn't glitch on loop
            const cardTransition = skipAnim
              ? "none"
              : `width ${DUR}ms ${EASE}, opacity ${DUR}ms ease`;

            const contentTransition = skipAnim
              ? "none"
              : `height ${DUR}ms ${EASE}`;

            const fontTransition = skipAnim
              ? "none"
              : `font-size ${DUR}ms ease`;

            return (
              <div
                key={item.uid}
                onClick={() => {
                  if (!hasMoved.current) goTo(index);
                }}
                className="flex-shrink-0 rounded-[24px] overflow-hidden who-is-peoplems-card"
                style={{
                  width: isActive ? `${ACTIVE_W}px` : `${INACTIVE_W}px`,
                  transition: cardTransition,
                  background: isActive
                    ? "rgba(252, 223, 100, 0.7)"
                    : "rgba(252, 223, 100, 0.20)",
                  opacity: isActive ? 1 : 0.72,
                  cursor: isActive ? "default" : "pointer",
                }}
              >
                <div
                  style={{
                    padding: "16px",
                    height: isActive ? "330px" : "260px",
                    transition: contentTransition,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                      overflow: "hidden",
                      background:
                        "linear-gradient(135deg,#d4c5f0 0%,#b8a9e3 50%,#9c8cd6 100%)",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      draggable={false}
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ borderRadius: "12px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  </div>
                </div>

                <div className="px-4 pb-5">
                  <p
                    className="font-['Sequel_Sans'] text-brand-dark who-is-peoplems-card-text-size"
                    style={{
                      fontSize: isActive ? "22px" : "16px",
                      fontWeight: isActive ? 420 : 405,
                      transition: fontTransition,
                      opacity: isActive ? 1 : 0.75,
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
