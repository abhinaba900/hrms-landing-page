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
  const [skipAnim, setSkipAnim] = useState(false);
  const [cardConfig, setCardConfig] = useState({
    activeW: 340,
    inactiveW: 260,
    gap: 16,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        // Mobile: Show one main card with small padding on sides
        // activeW is almost screen width minus some margin
        const mobileActiveW = Math.min(width - 64, 340);
        setCardConfig({
          activeW: mobileActiveW,
          inactiveW: mobileActiveW * 0.8,
          gap: 12,
        });
      } else if (width < 1024) {
        setCardConfig({ activeW: 310, inactiveW: 240, gap: 14 });
      } else {
        setCardConfig({ activeW: 340, inactiveW: 260, gap: 16 });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const hasMoved = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Centering math ──────────────────────────────────────────────────── */
  const getTranslateX = useCallback(
    (index: number): number => {
      const containerW = containerRef.current?.clientWidth ?? 0;
      const leftOffset = index * (cardConfig.inactiveW + cardConfig.gap);
      const activeCardCenter =
        cardConfig.inactiveW / 2 +
        (cardConfig.activeW - cardConfig.inactiveW) / 2;
      return containerW / 2 - leftOffset - activeCardCenter;
    },
    [cardConfig],
  );

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
      if (e.target !== trackRef.current) return;

      let nextIdx = activeIdx;
      if (activeIdx < N) {
        nextIdx = activeIdx + N;
      } else if (activeIdx >= 2 * N) {
        nextIdx = activeIdx - N;
      }

      if (nextIdx !== activeIdx) {
        setSkipAnim(true);
        setActiveIdx(nextIdx);
        applyTransform(nextIdx, false);
      }
    },
    [activeIdx, applyTransform],
  );

  /* ── Re-enable animations immediately after the jump ─────────────────── */
  useEffect(() => {
    if (skipAnim) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardConfig]);

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
    <section className="py-16 md:py-24 pb-0 md:pb-0 bg-[#FCFFF4] overflow-hidden who-is-peoplems-for-section">
      <div className="max-w-[1312px] mx-auto px-6 lg:px-16 mb-10 md:mb-14">
        <div className="flex flex-col items-center text-center">
          <div className="relative inline-block">
            <img
              src="/assets/who-is-people-ms-for-heading-right-top-image.png"
              alt="Crown"
              className="absolute -top-6 md:-top-10 -right-16 md:-right-24 w-16 md:w-[100px] h-auto pointer-events-none"
            />
            <h2 className="text-3xl md:text-[52px] who-is-peoplems-title-size spradesheet-usage-text-in-inventory-management leading-[1.2] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px]">
              Who is PeopleMS for?
            </h2>
          </div>
          <p className="text-base md:text-[18px] who-is-peoplems-subtext font-['Sequel_Sans'] font-normal text-brand-dark mt-4 max-w-[560px] ">
            Designed to adapt across industries, team sizes, and work models.
          </p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative w-full h-[480px] md:h-[420px] overflow-hidden"
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
          style={{ gap: `${cardConfig.gap}px` }}
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
                  width: isActive
                    ? `${cardConfig.activeW}px`
                    : `${cardConfig.inactiveW}px`,
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
