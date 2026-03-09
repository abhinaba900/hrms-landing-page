import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Set Up Organisation \n& Policies",
      description: "Configure company details & HR rules.",
      arrow: "/assets/wavy line 1 for HRMS.svg",
      arrowAlt: "Arrow connecting step 1 to 2",
    },
    {
      number: 2,
      title: "Onboard your \nEmployees",
      description: "Quickly onboard & assign access.",
      arrow: "/assets/Wavy line 2 for HRMS.svg",
      arrowAlt: "Arrow connecting step 2 to 3",
    },
    {
      number: 3,
      title: "Configure Payroll & \nAttendance",
      description: "Automate salaries, shifts, & tracking.",
      arrow: "/assets/wavy line 1 for HRMS.svg",
      arrowAlt: "Arrow connecting step 3 to 4",
    },
    {
      number: 4,
      title: "Go Live with \nPeopleMS",
      description: "Start using PeopleMS in a few hours.",
      arrow: null, // No arrow after the last step
    },
  ];

  return (
    <section className="relative py-24 bg-brand-bg overflow-hidden why-manufactures-love-us-in-inventory-management">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-2 flex flex-col items-center relative z-1 how-it-works-section-container">
        <h2 className="text-3xl md:text-[52px] spradesheet-usage-text-in-inventory-management leading-[1.2] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] mb-4 text-center">
          How it Works
        </h2>
        <p className="text-lg md:text-[20px] video-section-subtext-text-in-inventory-management font-['Sequel_Sans'] font-[405] text-brand-dark text-center mb-12 md:mb-20 tracking-wide">
          Simple. Fast. Powerful.
        </p>

        <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-4 relative">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex flex-col items-center lg:items-start text-center lg:text-left relative w-full max-w-[280px]"
            >
              {/* Step Number Circle */}
              <div className="w-[60px] h-[60px] md:w-[72px] md:h-[72px] bg-[#0A0F0A] rounded-full flex items-center justify-center mb-6 z-1">
                <span className="text-white how-it-works-number-text-in-inventory-management text-2xl md:text-[32px] font-['Sequel_Sans'] font-[420]">
                  {step.number}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-[20px] md:text-[24px] how-it-works-title-text-in-inventory-management font-['Sequel_Sans'] font-[420] text-brand-dark leading-[1.2] mb-3 pr-4 whitespace-pre-line">
                {step.title}
              </h3>
              <p className="text-[15px] md:text-base how-it-works-description-text-in-inventory-management font-['Sequel_Sans'] font-[405] text-brand-dark/80 leading-[1.4] pr-4">
                {step.description}
              </p>

              {/* Arrow linking to next step (Desktop only) */}
              {step.arrow && (
                <div className="hidden lg:block absolute top-2 -right-16 xl:right-10 w-[100px] xl:w-[130px] z-0 pointer-events-none">
                  <Image
                    src={step.arrow}
                    alt={step.arrowAlt!}
                    width={100}
                    height={30}
                    className="w-full h-auto object-contain opacity-80"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
