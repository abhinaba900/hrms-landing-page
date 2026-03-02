"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface HorizontalScrollerProps {
  data: unknown[][];
  renderCard: (item: unknown, index: number) => React.ReactNode;
  velocity?: number;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
  isHoverable?: boolean;
  hoverCardStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

const VelocityScroller: React.FC<{
  items: unknown[];
  renderCard: (
    item: unknown,
    index: number,
    isHovered: boolean
  ) => React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
  isHoverable?: boolean;
  hoverCardStyle?: React.CSSProperties;
}> = ({
  items,
  renderCard,
  baseVelocity,
  scrollContainerRef,
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
  isHoverable = true,
}) => {
  const baseX = useMotionValue(0);
  const scrollOptions = scrollContainerRef
    ? { container: scrollContainerRef }
    : {};
  const { scrollY } = useScroll(scrollOptions);
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const copyRef = useRef<HTMLDivElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [shouldStop, setShouldStop] = useState(false);

  const wrap = (min: number, max: number, v: number): number => {
    const range = max - min;
    return ((((v - min) % range) + range) % range) + min;
  };

  const x = useTransform(baseX, (v) =>
    copyWidth === 0 ? "0px" : `${wrap(-copyWidth, 0, v)}px`
  );

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    if (isHoverable && shouldStop) return;

    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    directionFactor.current = velocityFactor.get() >= 0 ? 1 : -1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const handleMouseEnter = (index: number) => {
    if (!isHoverable) return;
    setHoveredCard(index);
    setShouldStop(true);
  };

  const handleMouseLeave = () => {
    if (!isHoverable) return;
    setHoveredCard(null);
    setShouldStop(false);
  };

  const blocks = [];
  for (let i = 0; i < numCopies; i++) {
    blocks.push(
      <div
        key={i}
        ref={i === 0 ? copyRef : null}
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={`${i}-${idx}`}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={handleMouseLeave}
            style={{
              // ...(hoveredCard === idx ? hoverCardStyle : {}),
              transition: "all 300ms ease-in-out",
              // margin: "0 8px", // Consistent spacing between cards
            }}
          >
            {renderCard(item, idx, hoveredCard === idx)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={parallaxClassName}
      style={{
        position: "relative",
        overflow: "hidden",
        ...parallaxStyle,
      }}
    >
      <motion.div
        className={scrollerClassName}
        style={{
          display: "flex",
          ...scrollerStyle,
          x,
        }}
      >
        {blocks}
      </motion.div>
    </div>
  );
};

const HorizontalScroller: React.FC<HorizontalScrollerProps> = ({
  data,
  renderCard,
  velocity = 100,
  damping,
  stiffness,
  numCopies,
  scrollContainerRef,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
  isHoverable = true,
  hoverCardStyle,
}) => {
  const wrappedRenderCard = (item: unknown, index: number) => {
    return renderCard(item, index);
  };

  return (
    <section>
      {data.map((items, index) => (
        <div
          key={index}
          style={{ marginBottom: index !== data.length - 1 ? "20px" : "0" }}
        >
          <VelocityScroller
            items={items}
            renderCard={wrappedRenderCard}
            baseVelocity={index % 2 === 0 ? velocity : -velocity}
            scrollContainerRef={scrollContainerRef}
            damping={damping}
            stiffness={stiffness}
            numCopies={numCopies}
            velocityMapping={velocityMapping}
            parallaxClassName={parallaxClassName}
            scrollerClassName={scrollerClassName}
            parallaxStyle={parallaxStyle}
            scrollerStyle={scrollerStyle}
            isHoverable={isHoverable}
            hoverCardStyle={hoverCardStyle}
          />
        </div>
      ))}
    </section>
  );
};

export default HorizontalScroller;
