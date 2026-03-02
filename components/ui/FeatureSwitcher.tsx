"use client";
import { useState } from "react";

export default function FeatureSwitcher({setOpen}: any) {
  const [active, setActive] = useState(0);

  const images = [
    "/assets/Raw Materials Tracking.webp",
    "/assets/Production Monitoring.webp",
    "/assets/Quality Control & Defect Tracking.webp",
    "/assets/Vendor Management.webp",
    "/assets/Smart Reports & Analytics.webp",
  ];

  const items = [
    {
      title: "Raw Materials Tracking",
      desc: "Get instant low-stock alerts to restock materials before they run out.",
    },
    {
      title: "Production Monitoring",
      desc: "Track every production step live and prevent delays.",
    },
    {
      title: "Quality Control & Defect Tracking",
      desc: "Detect defects quickly and improve overall output quality.",
    },
    {
      title: "Vendor Management",
      desc: "Manage suppliers, POs, and deliveries with full visibility.",
    },
    {
      title: "Smart Reports & Analytics",
      desc: "AI-powered insights that optimize factory performance.",
    },
  ];

  return (
    <div className="bg-[#FFFFFF] rounded-[32px] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 p-8 flex flex-col justify-between productivity-card-content-holder-in-inventory-management">
          <div>
            <h3 className="text-[28px] leading-[33.6px] system-usage-card-title-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.56px] mb-8">
              You make the products. Our system manages the process.
            </h3>

            <button onClick={() => setOpen(true)} className="button explore-more-in-features-section-in-inventory-management nav-links-in-inventory-management-get-in-touch type1 px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors">
              <span>Explore more</span>
            </button>
          </div>

          {/* ACCORDION AREA */}
          <div className="space-y-0 mt-10 group">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;

              return (
                <div
                  key={index}
                  onClick={() => setActive(index)}
                  className={`
          py-4 cursor-pointer transition px-4 
          hover:bg-[#F5F9F5] hover:rounded-sm
          group-hover:border-transparent
          ${!isLast ? "border-b border-[rgba(10,15,10,0.1)]" : ""}
          ${active === index ? "" : ""}
        `}
                >
                  {/* TITLE */}
                  <h4
                    className={`text-lg font-['Sequel_Sans'] spradesheet-usage-subtext-in-inventory-management font-normal ${
                      active === index ? "text-brand-purple row-materials-tracking-heading-in-inventory-management" : "text-brand-dark"
                    }`}
                  >
                    {item.title}
                  </h4>

                  {/* SUBTEXT (ACCORDION CONTENT) */}
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: active === index ? "160px" : "0px",
                      opacity: active === index ? 1 : 0,
                    }}
                  >
                    <p className="text-base mt-2 font-['Sequel_Sans'] font-normal text-brand-dark/80 row-materials-tracking-subtext-text-in-inventory-management">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="lg:col-span-3 relative bg-brand-bg relative">
          <div className="absolute opacity-80">
            <div className="w-full h-full rounded-full bg-[#5B68DF]/90 z-1 blur-[273px]" />
          </div>

          <div className="relative pt-8 pl-8 background-image-for-dashboard-image-in-inventory-management">
            <img
              src={images[active]}
              alt="Dashboard Screenshot"
              className="w-full shadow-xl transition-all duration-500 rounded-tl-2xl"
              style={{
                boxShadow:
                  "0px -4px 24px rgba(0,0,0,0.10), -4px 0px 24px rgba(0,0,0,0.08)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
