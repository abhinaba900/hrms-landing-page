"use client";

import Slider from "react-slick";
import Image from "next/image";
import { useRef } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface TestimonialItem {
  id: number;
  message: string;
  author: string;
  role: string;
  company: string;
  avatar: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: 1,
    message:
      "Attendance, payroll, and leave approvals are now completely streamlined. What used to take days is handled automatically, and our team finally has clarity across HR operations.",
    author: "Ramesh K",
    role: "Founder",
    company: "Banna Sprays",
    avatar: "/assets/ramesh_k_avatar.png",
  },
  {
    id: 2,
    message:
      "Working with PeopleMS has transformed our HR processes. The automation features have saved us countless hours every week.",
    author: "Suresh M",
    role: "Operations Manager",
    company: "Generic Manufacturing Co.",
    avatar: "/assets/ramesh_k_avatar.png",
  },
];

export default function TestimonialSlider() {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
  };

  return (
    <section className="py-24 bg-[#FCFFF4] overflow-hidden">
      <div className="max-w-[1312px] mx-auto px-6 lg:px-16">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-[52px] leading-[62.4px] center-align-text spradesheet-usage-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] mb-12">
            Trusted by teams that <br /> rely on us
          </h2>

          <div className="text-brand-purple mb-8">
            <img src="/assets/quoma.png" alt="quoma" />
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto px-16">
          <Slider ref={sliderRef} {...settings}>
            {testimonials.map((item) => (
              <div key={item.id}>
                <div className="flex flex-col items-center text-center">
                  <p className="text-[28px] leading-[140%] testimonial-slider-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark mb-10 transformes-how-we-manage-production-subheader-in-inventory-management">
                    “{item.message}”
                  </p>

                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400">
                      <img
                        src={item.avatar}
                        alt={item.author}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/assets/who-is-people-ms-for-manufacturing.jpg"; // fallback
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-lg font-['Sequel_Sans'] text-brand-dark testimonial-slider-author-in-inventory-management slider-subheader-in-inventory-management">
                    - {item.author}, {item.role} @ {item.company}
                  </p>
                </div>
              </div>
            ))}
          </Slider>

          {/* Navigation Arrows */}
          <div className="absolute top-[1%] -left-4 xl:-left-20">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-14 h-14 circle-button flex items-center justify-center transition-all bg-white border border-black rounded-full hover:bg-black/5"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="absolute top-[1%] -right-4 xl:-right-20">
            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-14 h-14 circle-button flex items-center justify-center transition-all bg-white border border-black rounded-full hover:bg-black/5"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
