"use client";

import Slider from "react-slick";
import Image from "next/image";
import { useRef } from "react";

interface TestimonialItem {
  id: number;
  title: string;
  message: string;
  author: string;
  company: string;
  image: string;
  logo: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    title: "They transformed how we manage production.",
    message:
      "We reduced stock wastage by 40% with Third Eye's inventory tool. The live tracking system gave us complete control over raw materials and production flow — we've never been this efficient.",
    author: "Operations Head",
    company: "Space Luggage",
    image: "assets/space-luggage-main-image.webp",
    logo: "assets/space-luggage-icon.webp",
  },
  {
    id: 2,
    title: "A game changer for high-volume inventory.",
    message:
      "Managing multiple shades and finishes was complex. Third Eye Creative gave us real-time stock visibility and automated alerts now production is faster and far more accurate.",
    author: "Operations Head",
    company: "Banna Spray Paints",
    image: "assets/space-luggage-main-image.webp",
    logo: "assets/brand-image1.webp",
  },
 
];

export default function TestimonialSection() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
  };

  return (
    <div className="relative w-full">
      {/* SLIDER */}
      <Slider ref={sliderRef} {...settings}>
        {testimonials.map((item) => (
          <div key={item.id}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 items-center relative">
              {/* LEFT IMAGE */}
              <div>
                <img
                  src={item.image}
                  alt="Customer Testimonial"
                  className="w-full rounded-2xl"
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="relative">
                <h3 className="text-[28px] leading-[33.6px] testimonial-sub-header-in-inventory-management why-manufacturers-love-us-header-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.56px] mb-6">
                  {item.title}
                </h3>

                <p className="text-xl font-['Sequel_Sans'] transformes-how-we-manage-production-subheader-in-inventory-management font-normal text-brand-dark leading-relaxed mb-8">
                  “{item.message}”
                </p>

                <p className="text-[22px] font-['Sequel_Sans'] text-brand-dark slider-subheader-in-inventory-management mb-[2.5rem]">
                  <span className="font-normal">{item.author},</span>{" "}
                  {item.company}
                </p>

                <div className="flex items-center justify-between gap-4 mb-8">
                  <img
                    src={item.logo}
                    alt="Company Logo"
                    width={55}
                    height={55}
                    className="h-20 w-45 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* ABSOLUTE BUTTONS — OUTSIDE SLIDER */}
      <div
        className="
        absolute 
        right-0 
        top-[65%] 
        flex gap-3 
        z-1
        mobile-position-of-absolute-container-buttons
      "
      >
        {/* PREV */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="w-16 h-16 circle-button next-prev-button-in-inventory-management rounded-full border-[1.5px] border-brand-dark bg-brand-bg flex items-center justify-center hover:bg-brand-dark/5"
        >
          <svg width="32" height="13" viewBox="0 0 32 13" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.4458 5.01261C3.0509 4.3924 7.98002 3.37939 10.0747 0.962047C11.4532 -0.633661 12.1378 -0.119253 10.914 1.58641C10.0161 2.8338 8.43921 4.07372 6.7947 4.82349C8.70004 4.84838 17.4619 4.73785 28.9835 5.20635C31.2996 5.30477 31.5606 5.49158 31.2531 6.12314C30.8536 6.91175 30.2475 7.31374 29.4565 7.31029C29.4363 7.30916 5.58863 7.00649 5.58126 7.25946C5.57847 7.29985 5.89717 7.53054 6.294 7.80599C9.0074 9.63938 9.98453 11.2037 8.89515 11.9946C8.38215 12.3714 7.47473 11.9967 5.94561 10.7867C5.31083 10.2851 3.80015 9.24838 2.57584 8.47081C-0.522564 6.48425 -0.732556 5.85431 1.4458 5.01261Z"
              fill="black"
            />
          </svg>
        </button>

        {/* NEXT */}
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="w-16 h-16 circle-button next-prev-button-in-inventory-management rounded-full border-[1.5px] border-brand-dark bg-brand-bg flex items-center justify-center hover:bg-brand-dark/5"
        >
          <svg width="32" height="13" viewBox="0 0 32 13" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M29.9121 5.01261C28.307 4.3924 23.3779 3.37939 21.2832 0.962047C19.9047 -0.633661 19.2201 -0.119253 20.4439 1.58641C21.3418 2.8338 22.9187 4.07372 24.5632 4.82349C22.6579 4.84838 13.896 4.73785 2.37445 5.20635C0.0582945 5.30477 -0.202671 5.49158 0.104792 6.12314C0.504279 6.91175 1.1104 7.31374 1.90138 7.31029C1.92159 7.30916 25.7693 7.00649 25.7766 7.25946C25.7794 7.29985 25.4607 7.53054 25.0639 7.80599C22.3505 9.63938 21.3734 11.2037 22.4628 11.9946C22.9758 12.3714 23.8832 11.9967 25.4123 10.7867C26.0471 10.2851 27.5578 9.24838 28.7821 8.47081C31.8805 6.48425 32.0905 5.85431 29.9121 5.01261Z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
