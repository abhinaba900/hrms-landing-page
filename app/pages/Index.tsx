"use client";

import { useEffect, useRef, useState } from "react";
import HorizontalScroller from "./ScrollVelocity";
import {
  Menu,
  X,
  Cloud,
  Network,
  FileText,
  Users,
  AppWindow,
  Smartphone,
} from "lucide-react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import FeatureSwitcher from "@/components/ui/FeatureSwitcher";
import Link from "next/link";
import HowItWorks from "@/components/ui/HowItWorks";
import WhoIsPeopleMS from "@/components/ui/WhoIsPeopleMS";
import TestimonialSlider from "@/components/ui/TestimonialSlider";
import NextImage from "next/image";

// --- 1. TypeScript Augmentation ---
declare module "react" {
  interface InputHTMLAttributes<T> {
    checktype?: string;
    phoneFormat?: string;
    valType?: string;
    phoneFormatType?: string;
    isCountryCodeEnabled?: string;
  }
  interface TextareaHTMLAttributes<T> {
    checktype?: string;
  }
}

declare global {
  interface Window {
    zf_ValidateAndSubmit?: () => boolean;
  }
}

// --- 2. Zoho Validation Script Component ---
const ZohoValidationScript: React.FC = () => {
  useEffect(() => {
    // UPDATED: Fields specific to your Contact Form
    const zf_MandArray = [
      "Name_First",
      "Name_Last",
      "Email",
      "PhoneNumber_countrycode",
      "MultiLine", // Usually the name for "Message" in Zoho
    ];
    const zf_FieldArray = [
      "Name_First",
      "Name_Last",
      "Email",
      "PhoneNumber_countrycode",
      "MultiLine",
    ];
    const isSalesIQIntegrationEnabled = false;

    // --- Validation Logic (Minified/Standard Zoho Logic) ---
    function zf_ValidateAndSubmit() {
      if (zf_CheckMandatory()) {
        if (zf_ValidCheck()) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    function zf_CheckMandatory() {
      for (let i = 0; i < zf_MandArray.length; i++) {
        const fieldObj = (document.forms as any)["contact_form"][
          zf_MandArray[i]
        ];
        if (fieldObj) {
          if (fieldObj.value.replace(/^\s+|\s+$/g, "").length === 0) {
            fieldObj.focus();
            zf_ShowErrorMsg(zf_MandArray[i]);
            return false;
          }
        }
      }
      return true;
    }

    function zf_ValidCheck() {
      let isValid = true;
      for (let ind = 0; ind < zf_FieldArray.length; ind++) {
        const fieldObj = (document.forms as any)["contact_form"][
          zf_FieldArray[ind]
        ];
        if (fieldObj) {
          const checkType = fieldObj.getAttribute("checktype");
          if (checkType === "c1") {
            // Text
            if (fieldObj.value.replace(/^\s+|\s+$/g, "").length === 0) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType === "c5") {
            // Email
            if (!zf_ValidateEmailID(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          } else if (checkType === "c7") {
            // Phone
            if (!zf_ValidatePhone(fieldObj)) {
              isValid = false;
              fieldObj.focus();
              zf_ShowErrorMsg(zf_FieldArray[ind]);
              return false;
            }
          }
        }
      }
      return isValid;
    }

    function zf_ShowErrorMsg(uniqName: string) {
      let fldLinkName;
      for (let errInd = 0; errInd < zf_FieldArray.length; errInd++) {
        fldLinkName = zf_FieldArray[errInd].split("_")[0];
        const errorElement = document.getElementById(fldLinkName + "_error");
        if (errorElement) {
          errorElement.style.display = "none";
        }
      }
      const linkName = uniqName.split("_")[0];
      const linkErrorElement = document.getElementById(linkName + "_error");
      if (linkErrorElement) {
        linkErrorElement.style.display = "block";
      }
    }

    function zf_ValidateEmailID(elem: HTMLInputElement) {
      let check = 0;
      const emailValue = elem.value;
      if (emailValue != null && emailValue !== "") {
        const emailArray = emailValue.split(",");
        for (let i = 0; i < emailArray.length; i++) {
          const emailExp =
            /^[\w]([\w\-.+&']*)@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,22}$/;
          if (!emailExp.test(emailArray[i].replace(/^\s+|\s+$/g, ""))) {
            check = 1;
          }
        }
        if (check === 0) return true;
        else return false;
      }
      return true;
    }

    function zf_ValidatePhone(inpElem: HTMLInputElement) {
      // Simplified Phone Regex for generic use
      const phoneRegex = /^[+]{0,1}[()0-9-. ]+$/;
      const fieldInpVal = inpElem.value.replace(/^\s+|\s+$/g, "");
      if (fieldInpVal !== "" && !phoneRegex.test(fieldInpVal)) {
        return false;
      }
      return true;
    }

    if (typeof window !== "undefined") {
      window.zf_ValidateAndSubmit = zf_ValidateAndSubmit;
    }
  }, []);

  return null;
};
type partner = {
  name: string;
  logo: string;
};

export default function Index() {
  const images: partner[] = [
    {
      name: "Brand 1",
      logo: "assets/brand-image1.webp",
    },
    {
      name: "Brand 2",
      logo: "assets/brand-image-2.webp",
    },
    {
      name: "Brand 3",
      logo: "assets/brand-image-3.webp",
    },
    {
      name: "Brand 4",
      logo: "assets/brand-image-4.webp",
    },
  ];

  const ZOHO_ACTION_URL =
    "https://forms.zohopublic.in/thirdeyecreative1/form/JobApplication/formperma/f5DRM3GnMpr5ebcjgRPnlI2nKpggSkc0q7PC5ula4pw/htmlRecords/submit";

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    Name_First: "",
    Name_Last: "",
    Email: "",
    PhoneNumber_countrycode: "",
    MultiLine: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Hide error message on change
    const namePart = e.target.name.split("_")[0];
    const errorEl = document.getElementById(`${namePart}_error`);
    if (errorEl) errorEl.style.display = "none";
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Prevent Default React Submission
    e.preventDefault();

    // 2. Run Zoho Validation
    if (typeof window.zf_ValidateAndSubmit === "function") {
      const isValid = window.zf_ValidateAndSubmit();

      if (isValid) {
        // 3. If Valid: Submit the form programmatically
        // We use the Ref to submit the native HTML form so it hits the 'action' URL
        if (formRef.current) {
          formRef.current.submit();
        }

        // 4. Update UI State
        // We use a small timeout to allow the submission to fire to the iframe first
        setTimeout(() => {
          setIsSubmitted(true);
          setFormData({
            Name_First: "",
            Name_Last: "",
            Email: "",
            PhoneNumber_countrycode: "",
            MultiLine: "",
          });
        }, 100);
      }
    }
  };
  const [mobileOpen, setMobileOpen] = useState(false);

  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      // 👉 If fully at top, always hide
      if (currentScroll === 0) {
        setIsScrollingUp(false); // nav-hide
        setLastScrollY(0);
        return;
      }

      // 👉 Detect scroll direction
      if (currentScroll < lastScrollY) {
        setIsScrollingUp(true); // scrolling UP → show
      } else {
        setIsScrollingUp(false); // scrolling DOWN → hide
      }

      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-brand-bg font-sans ">
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed max-w-[70%] mx-auto bg-[#F5F9F5] inset-0 z-10  overflow-y-auto p-6 pb-6 px-10 popup-content-holder-in-inventory-management">
          <div className="min-h-screen bg-brand-bg font-sequel relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 popup-section-close-button-in-inventory-management">
              <button
                className="w-10 h-10 circle-button md:w-[42px] md:h-[42px] rounded-full border-3 border-apply-in-inventory-management border-brand-text flex items-center justify-center hover:bg-brand-text/5 transition-colors"
                aria-label="Close"
                onClick={() => {
                  setOpen(false);
                  setMobileOpen(false);
                  setIsSubmitted(false);
                  setFormData({
                    Name_First: "",
                    Name_Last: "",
                    Email: "",
                    PhoneNumber_countrycode: "",
                    MultiLine: "",
                  });
                }}
              >
                {/* <img
                  src="assets/close-icon-in-popup.svg"
                  className="cursor-pointer"
                  alt=""
                /> */}

                <svg
                  width="18"
                  height="15"
                  viewBox="0 0 18 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4925 0.422799C17.2166 0.34228 16.7307 0.249374 16.0049 0.136337C15.0347 -0.0130881 14.6989 -0.00805576 14.5302 0.00742871C14.5275 0.00781582 14.5086 0.00975121 14.5063 0.00975121C14.3149 0.0329779 13.9765 0.118917 13.0449 0.599709C12.3623 0.952755 11.3552 1.64027 9.96693 2.70018C9.39311 3.13839 8.81626 3.60176 8.24775 4.08294C6.86929 3.16974 5.40253 2.28674 3.89445 1.46336C3.87702 1.45484 3.8592 1.44632 3.84139 1.43858C3.61057 1.35148 1.56506 0.589645 0.693719 0.673261C0.209345 0.720101 0.0236309 1.0236 0.0118816 1.29225C-0.0411797 2.43423 0.0816193 3.04819 0.4178 3.34472C0.564477 3.4775 0.933631 3.7446 2.38372 4.47547C3.51847 5.04104 4.64792 5.67319 5.74743 6.35645C4.56037 7.51468 3.39909 8.7488 2.28897 10.0294C2.27646 10.0448 2.26433 10.0599 2.25296 10.0766C1.4741 11.267 0.594039 12.82 0.824098 13.465C0.891562 13.6527 1.03634 13.7917 1.22206 13.8463C1.90503 14.0468 2.40987 14.1289 2.76576 14.0952C2.97308 14.0747 3.13833 14.0166 3.27174 13.9187C3.4332 13.8022 3.77392 13.4967 4.80445 12.2301C5.90433 10.8644 7.14521 9.51954 8.49941 8.22852C8.9762 8.57769 9.38061 8.8839 9.75355 9.1812C12.0613 11.0165 13.8161 12.6989 14.9661 14.1835C15.275 14.6 15.3852 14.7215 15.447 14.7796C15.6278 14.9515 15.812 14.9945 15.9356 14.9995C15.9666 15.0006 15.9958 14.9999 16.0239 14.9968C16.2657 14.9736 16.5545 14.7854 16.5734 14.3313C16.5856 14.0445 16.5624 13.5393 16.501 12.7922C16.4165 11.7679 16.3309 11.4354 16.2736 11.2732C16.2085 11.0885 16.0466 10.7722 15.372 9.95891C14.8778 9.36585 13.9651 8.50066 12.6571 7.38732C12.1235 6.93324 11.5671 6.48497 10.9671 6.02469C10.9777 6.01617 10.9887 6.00766 10.999 5.99914C13.284 4.1321 15.2943 2.78031 16.9722 1.98363C17.4399 1.77382 17.5801 1.69369 17.6491 1.64723C17.8162 1.53187 17.9257 1.38361 17.9746 1.21173C18.0588 0.917528 17.9424 0.55674 17.4925 0.422799Z"
                    fill="#0A0F0A"
                  />
                </svg>
              </button>
            </div>

            <div className="container mx-auto px-0  popup-section-left-content-holder-in-inventory-management">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-center  relative popup-heading-container-in-inventory-management">
                  <div className="absolute left-6 -top-2 hidden md:block">
                    <img
                      src="assets/ready-to-automate-your-factory-right-logo.webp"
                      alt="Robot illustration"
                      className="w-32 lg:w-[181px] h-auto transform -rotate-[10deg]"
                    />
                  </div>
                  <h1 className="text-3xl ready-to-automate-your-factory-heading md:text-4xl lg:text-[52px] font-[420] leading-[120%] tracking-[-0.02em] text-brand-text text-center mb-8 md:mb-12 lg:mb-[5rem]">
                    Ready to Automate <br /> Your Factory?
                  </h1>

                  <div className=" hidden lg:block">
                    <svg
                      width="47"
                      height="45"
                      viewBox="0 0 57 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_117_1359)">
                        <path
                          d="M23.7817 45.3332C23.6997 46.5596 26.5012 46.6664 35.7184 45.8266C45.4748 44.9311 47.5952 44.3762 47.1893 42.96C46.6073 41.0192 23.9651 43.3531 23.7817 45.3332Z"
                          fill="#EC4B7B"
                        />
                        <path
                          d="M16.3162 2.60838C12.66 2.62667 12.1928 3.25857 9.84483 11.3322C7.41106 19.6685 7.26189 21.2782 8.77934 21.8652C11.5352 22.9181 12.884 20.9178 16.4063 10.7572C19.0006 3.25944 19.0149 2.59484 16.3162 2.60838Z"
                          fill="#EC4B7B"
                        />
                        <path
                          d="M36.6279 15.0366C34.0012 15.0166 33.0466 15.5477 29.9626 18.7012C20.8497 28.0908 13.6019 34.0711 18.7158 34.0067C20.8032 33.9947 22.6758 32.4249 33.6972 21.798C39.7624 15.8945 40.142 15.0865 36.6279 15.0366Z"
                          fill="#EC4B7B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_117_1359">
                          <rect
                            width="47.1837"
                            height="44.6812"
                            fill="white"
                            transform="translate(10.5689) rotate(13.6824)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-[300px_1fr] lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-8 lg:gap-12 xl:gap-16 contact-and-form-holder-in-popup-invite-in-inventory-management">
                  <div className="space-y-[48px] md:space-y-8">
                    <div className="flex items-start gap-4 popup-section-left-content-item-in-inventory-management border-b border-[rgba(10,15,10,0.1)]">
                      <div className="flex-shrink-0 w-10 h-10 md:w-[42px] md:h-[42px] rounded-full bg-brand-purple flex items-center justify-center">
                        <img
                          src="assets/reach-out-to-us-popup-icon.svg"
                          className="-mb-4"
                          alt=""
                        />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-[420] text-brand-text mb-1 popup-section-left-content-heading">
                          Reach out to us
                        </h2>
                        <p className="text-lg md:text-xl font-[405] text-brand-text tracking-[-0.02em] popup-section-left-content-subtext">
                          +91 8041479167
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-brand-text/10 height-fixed-in-inventory-management-for-mobile"></div>

                    <div className="flex items-start gap-4 popup-section-left-content-item-in-inventory-management border-b border-[rgba(10,15,10,0.1)]">
                      <div className="flex-shrink-0 w-10 h-10 md:w-[42px] md:h-[42px] rounded-full bg-brand-purple flex items-center justify-center">
                        <img
                          src="assets/email-with-us-popup-icon.svg"
                          className="-mb-4"
                          alt=""
                        />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-[420] text-brand-text mb-1 popup-section-left-content-heading">
                          Email us at
                        </h2>
                        <p className="text-lg md:text-xl font-[405] text-brand-text tracking-[-0.02em] popup-section-left-content-subtext">
                          hi@thirdeyegfx.in
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-brand-text/10 height-fixed-in-inventory-management-for-mobile"></div>

                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 md:w-[42px] md:h-[42px] rounded-full bg-brand-purple flex items-center justify-center">
                        <img
                          src="assets/our-office-popup-icon.svg"
                          className="-mb-4"
                          alt=""
                        />
                      </div>
                      <div>
                        <h2 className="text-xl md:text-2xl font-[420] text-brand-text mb-1 popup-section-left-content-heading">
                          Our office
                        </h2>
                        <p className="text-lg md:text-xl font-[405] text-brand-text tracking-[-0.02em] popup-section-left-content-subtext">
                          4th Main Rd, Vijayanagar
                          <br />
                          Bangalore - 560040
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-form rounded-2xl p-6 md:p-8 lg:p-10 bg-[#EAEDE0] h-[600px] popup-form-content-holder-in-inventory-management">
                    {isSubmitted ? (
                      <div className="flex flex-col justify-center items-center w-full h-full">
                        <img
                          src="assets/after-submit-the-form-icon.svg"
                          alt="after submit logo"
                          className="mb-[28px]"
                        />
                        <p className="mb-[28px] success-massage-after-submiting-popup">
                          Your message has been sent!
                        </p>
                        <button
                          onClick={() => {
                            setIsSubmitted(false);
                            setOpen(false);
                          }}
                          className="button2 nav-links-in-inventory-management-get-in-touch type2 px-9 py-4 rounded-full bg-brand-purple  text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors"
                        >
                          <span>See How It Works</span>
                        </button>
                      </div>
                    ) : (
                      <>
                        <ZohoValidationScript />

                        {/* Success Message View */}
                        {isSubmitted ? (
                          <div className="text-center py-16 animate-fade-in">
                            <h3 className="text-2xl font-bold text-brand-purple mb-4">
                              Thank You!
                            </h3>
                            <p className="text-brand-text text-lg">
                              We have received your message and will get back to
                              you shortly.
                            </p>
                            <button
                              onClick={() => setIsSubmitted(false)}
                              className="mt-8 text-brand-purple hover:underline"
                            >
                              Send another message
                            </button>
                          </div>
                        ) : (
                          /* Form View */
                          <>
                            <p className="text-base font-[405] text-brand-text mb-8 leading-[140%] popup-section-right-content-subtext">
                              Fill in the form below and we will get back to you
                              as soon as possible.
                            </p>

                            <iframe
                              name="hidden_iframe"
                              id="hidden_iframe"
                              style={{ display: "none" }}
                            ></iframe>

                            <form
                              ref={formRef}
                              action={ZOHO_ACTION_URL}
                              method="POST"
                              target="hidden_iframe" // Keeps user on the page
                              onSubmit={handleSubmit}
                              id="contact_form"
                              name="contact_form" // Required for script
                              className="space-y-6"
                              encType="multipart/form-data"
                            >
                              {/* Hidden Fields for Zoho */}
                              <input
                                type="hidden"
                                name="zf_referrer_name"
                                value=""
                              />
                              <input
                                type="hidden"
                                name="zf_redirect_url"
                                value=""
                              />
                              <input type="hidden" name="zc_gad" value="" />

                              <div className="grid md:grid-cols-2 gap-6">
                                {/* First Name */}
                                <div>
                                  <label
                                    htmlFor="Name_First"
                                    className="block text-base font-[415] text-brand-text mb-2 leading-[140%] popup-section-right-content-subtext-label"
                                  >
                                    First Name
                                  </label>
                                  <input
                                    type="text"
                                    id="Name_First"
                                    name="Name_First" // Zoho Name
                                    checktype="c1"
                                    value={formData.Name_First}
                                    onChange={handleChange}
                                    placeholder="Enter your First name"
                                    className="w-full px-4 py-3.5 popup-section-right-content-subtext-input rounded-lg bg-white text-brand-text placeholder:text-brand-text/20 font-[405] text-base leading-[140%] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                  />
                                  <p
                                    id="Name_error"
                                    className="text-red-500 text-xs mt-1"
                                    style={{ display: "none" }}
                                  >
                                    Invalid value
                                  </p>
                                </div>

                                {/* Last Name */}
                                <div>
                                  <label
                                    htmlFor="Name_Last"
                                    className="block text-base font-[415] text-brand-text mb-2 leading-[140%] popup-section-right-content-subtext-label"
                                  >
                                    Last Name
                                  </label>
                                  <input
                                    type="text"
                                    id="Name_Last"
                                    name="Name_Last" // Zoho Name
                                    checktype="c1"
                                    value={formData.Name_Last}
                                    onChange={handleChange}
                                    placeholder="Enter your Last name"
                                    className="w-full px-4 py-3.5 popup-section-right-content-subtext-input rounded-lg bg-white text-brand-text placeholder:text-brand-text/20 font-[405] text-base leading-[140%] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                  />
                                </div>
                                {/* Note: Zoho often groups first/last name errors under "Name_error" or handles them separately. 
                    I placed the error under First Name for layout purposes, or you can duplicate for Last Name. */}

                                {/* Email */}
                                <div>
                                  <label
                                    htmlFor="Email"
                                    className="block text-base font-[415] text-brand-text mb-2 leading-[140%] popup-section-right-content-subtext-label"
                                  >
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    id="Email"
                                    name="Email" // Zoho Name
                                    checktype="c5"
                                    value={formData.Email}
                                    onChange={handleChange}
                                    placeholder="example@gmail.com"
                                    className="w-full px-4 py-3.5 popup-section-right-content-subtext-input rounded-lg bg-white text-brand-text placeholder:text-brand-text/20 font-[405] text-base leading-[140%] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                  />
                                  <p
                                    id="Email_error"
                                    className="text-red-500 text-xs mt-1"
                                    style={{ display: "none" }}
                                  >
                                    Invalid value
                                  </p>
                                </div>

                                {/* Contact Number */}
                                <div>
                                  <label
                                    htmlFor="PhoneNumber_countrycode"
                                    className="block text-base font-[415] text-brand-text mb-2 leading-[140%] popup-section-right-content-subtext-label"
                                  >
                                    Contact Number
                                  </label>
                                  <input
                                    type="tel"
                                    id="PhoneNumber_countrycode"
                                    name="PhoneNumber_countrycode" // Zoho Name
                                    checktype="c7"
                                    phoneFormat="1"
                                    isCountryCodeEnabled="false"
                                    value={formData.PhoneNumber_countrycode}
                                    onChange={handleChange}
                                    placeholder="+91 9876543210"
                                    className="w-full px-4 py-3.5 popup-section-right-content-subtext-input rounded-lg bg-white text-brand-text placeholder:text-brand-text/20 font-[405] text-base leading-[140%] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                  />
                                  <p
                                    id="PhoneNumber_error"
                                    className="text-red-500 text-xs mt-1"
                                    style={{ display: "none" }}
                                  >
                                    Invalid value
                                  </p>
                                </div>
                              </div>

                              {/* Message */}
                              <div>
                                <label
                                  htmlFor="MultiLine"
                                  className="block text-base font-[415] text-brand-text mb-2 leading-[140%] popup-section-right-content-subtext-label"
                                >
                                  Your Message
                                </label>
                                <textarea
                                  id="MultiLine"
                                  name="MultiLine" // Zoho Name for Text Area
                                  checktype="c1"
                                  value={formData.MultiLine}
                                  onChange={handleChange}
                                  placeholder="Write your message here..."
                                  rows={5}
                                  className="w-full popup-section-right-content-subtext-input px-4 py-3.5 rounded-lg bg-white text-brand-text placeholder:text-brand-text/20 font-[405] text-base leading-[140%] focus:outline-none focus:ring-2 focus:ring-brand-purple/20"
                                />
                                <p
                                  id="MultiLine_error"
                                  className="text-red-500 text-xs mt-1"
                                  style={{ display: "none" }}
                                >
                                  Required
                                </p>
                              </div>

                              <button
                                type="submit"
                                className="nav-links-in-inventory-management-get-in-touch button px-9 py-4 rounded-full bg-brand-purple text-brand-bg text-base font-[425] leading-[140%] hover:bg-brand-purple/90 transition-colors"
                              >
                                <span>Send Message</span>
                              </button>
                            </form>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Navigation */}
      <section
        className={`navigation-section-holder ${
          isScrollingUp ? "nav-show" : "nav-hide"
        }`}
      >
        <nav className="relative z-10 px-6 max-w-[1520px] mx-auto py-4 lg:px-16 lg:py-6 bg-brand-bg navbar-section-in-inventory-management">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img
              src="/assets/main-logo-navbar.webp"
              alt="Third Eye Logo"
              className="h-[50px] w-[150px] lg:h-[60px] lg:w-[173px]"
            />

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-4">
              {[
                "Problem",
                "Features",
                "Why PeopleMS",
                "How it works",
                "For whom?",
                "Pricing",
              ].map((label) => (
                <Link
                  href={`#${label.toLowerCase()}`}
                  key={label}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(label.toLowerCase())
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="px-5 py-2.5 rounded-full nav-links-in-inventory-management bg-brand-gray text-brand-dark font-['Sequel_Sans'] text-base font-normal hover:bg-brand-gray/50 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden lg:block nav-links-in-inventory-management-get-in-touch button px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors"
            >
              <span>Get in touch</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden text-brand-dark"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <Dialog open={mobileOpen} onClose={setMobileOpen}>
            <div
              className="w-full fixed mx-auto bg-[#F5F9F5] inset-0 z-10 p-0 border-none shadow-xl rounded-2xl bg-brand-bg 
               animate-in fade-in-0 zoom-in-95 duration-300"
            >
              <div className="flex justify-between items-center px-4 pt-[44px]">
                <img
                  src="/assets/main-logo-navbar.webp"
                  alt="Third Eye Logo"
                  className="h-[50px] w-[150px] lg:h-[60px] lg:w-[173px]"
                />
                <button
                  className="w-10 h-10 md:w-[42px] md:h-[42px] rounded-full border-[1.5px] border-brand-text flex items-center justify-center hover:bg-brand-text/5 transition-colors"
                  aria-label="Close"
                  onClick={() => setMobileOpen(false)}
                >
                  <img
                    src="assets/close-icon-in-popup.svg"
                    className="cursor-pointer"
                    alt=""
                  />
                </button>
              </div>
              <div className="flex flex-col gap-4 p-4 mt-4">
                {[
                  "Solution",
                  "Features",
                  "Benefits",
                  "Customers",
                  "Pricing",
                ].map((label, index, arr) => (
                  <Link
                    key={label}
                    href={`#${label.toLowerCase()}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileOpen(false);
                      document
                        .getElementById(label.toLowerCase())
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`w-full px-5 py-3 text-left font-['Sequel_Sans'] nav-links-in-inventory-management-get-in-touch text-base font-normal
        text-brand-dark transition-colors
        ${
          index !== arr.length - 1
            ? "border-b border-[rgba(10,15,10,0.1)] pb-4"
            : ""
        }
      `}
                  >
                    {label}
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className=" mt-[8px] nav-links-in-inventory-management-get-in-touch button px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors"
                >
                  <span>Get in touch</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="button2 type2 nav-links-in-inventory-management-get-in-touch px-9  py-4 rounded-full border-[1.5px] border-brand-bg bg-brand-bg text-brand-dark font-['Sequel_Sans'] text-base font-normal hover:bg-brand-bg/90 transition-colors"
                >
                  <span>Book a Free Demo</span>
                </button>
              </div>
            </div>
          </Dialog>
        </nav>
      </section>
      {/* Hero Section */}
      <section className="relative bg-brand-bg pt-[6.875rem] hero-section-in-inventory-management">
        {/* Background Blobs */}

        {/* Hero Content */}
        <div className="relative  max-w-[1312px] mx-auto px-16 pt-20 text-center hero-section-parennt-in-inventory-management">
          <h1 className="text-[84px] heading-section-title-in-inventory-management leading-[110px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.68px] mb-6">
            Manage People. Simplify HR. <br />
            Grow Faster.
          </h1>

          <p className="text-xl font-['Sequel_Sans'] subtext-section-title-in-inventory-management font-normal text-brand-dark mb-12 max-w-[875px] mx-auto">
            PeopleMS is an intelligent HR Management System designed to automate
            attendance, payroll, leave management, AI employee queries, reports,
            and benefits - all in one seamless platform.
          </p>

          {/* CTA Buttons */}
          <div className="relative flex items-center justify-center gap-5 mb-[5rem] button-content-holder-in-inventory-management">
            <button
              onClick={() => setOpen(true)}
              className="button nav-links-in-inventory-management-get-in-touch nav-links-in-inventory-management-get-in-touch type1 px-9 py-4 rounded-full bg-brand-purple  text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors"
            >
              <span>Start Free Trial</span>
            </button>
            <button className="button2 type2 px-9 py-4 nav-links-in-inventory-management-get-in-touch rounded-full bg-brand-purple  text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors">
              <span>Book a Live Demo</span>
            </button>
            <svg
              className="absolute w-[157px] -bottom-[8rem] -right-[4rem] in-mobile-not-visible desktop-hide-in-small-desktop"
              viewBox="0 0 157 123"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M95.3525 106.66C106.911 110.915 119.01 114.414 128.808 122.196C129.393 122.657 130.239 122.564 130.703 121.983C131.162 121.399 131.067 120.552 130.484 120.086C120.456 112.124 108.104 108.481 96.2764 104.129C95.5782 103.868 94.8008 104.229 94.5473 104.929C94.2889 105.626 94.6544 106.4 95.3525 106.66Z"
                fill="#5048E5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M100.064 89.3117C104.83 87.206 109.643 86.0534 114.859 86.4487C115.604 86.5054 116.249 85.9471 116.306 85.2041C116.357 84.4595 115.795 83.8096 115.056 83.7544C109.384 83.3241 104.152 84.5511 98.9715 86.838C98.2885 87.1381 97.9796 87.9354 98.285 88.6197C98.5853 89.301 99.3865 89.6128 100.064 89.3117Z"
                fill="#5048E5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M102.366 49.2399C105.963 44.0915 110.759 40.7417 116.887 39.234C117.61 39.0558 118.051 38.3232 117.867 37.5976C117.688 36.8738 116.953 36.4293 116.23 36.6075C109.447 38.2777 104.132 41.9819 100.149 47.6822C99.7208 48.2915 99.8758 49.1378 100.485 49.5665C101.099 49.9975 101.943 49.8509 102.366 49.2399Z"
                fill="#5048E5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M47.5409 21.9662C46.1548 22.7955 44.8405 23.7501 43.6316 24.8315C43.0929 25.3128 42.072 26.3779 41.6131 27.4336C41.12 28.5569 41.184 29.6684 42.0227 30.5288C43.1372 31.6703 44.235 31.9659 45.2027 31.8359C46.1341 31.7118 47.0208 31.1456 47.767 30.2354C49.1924 28.4954 50.1096 25.4055 50.3035 23.5297C51.7307 22.7984 53.2255 22.2037 54.7657 21.7471C66.2343 18.3463 78.9937 25.4009 86.1294 38.7777C88.6267 43.4607 87.9513 51.2743 86.2404 59.3695C83.5785 71.9742 78.1986 85.2309 76.7477 89.1573C76.3918 90.1281 76.2878 90.7406 76.2999 90.8742C76.3474 91.5272 76.722 91.8203 76.9996 91.9777C77.403 92.2014 77.773 92.2363 78.0976 92.1872C78.5373 92.1184 78.9609 91.8775 79.2839 91.3926C79.4601 91.1243 79.6186 90.7209 79.7565 90.28C79.8483 89.9732 79.8988 89.6209 80.0336 89.424C80.9024 88.1677 81.8419 86.9721 82.7743 85.7634C85.8976 81.6958 89.3834 78.0746 93.0919 74.536C104.876 63.2903 116.686 51.1893 131.951 44.768C132.635 44.4797 132.959 43.6879 132.667 42.9993C132.38 42.3125 131.588 41.9886 130.899 42.2756C115.329 48.8226 103.245 61.1082 91.2271 72.5761C88.0729 75.5868 85.0753 78.6567 82.3174 81.9965C84.7577 75.2558 87.8735 65.8354 89.438 57.0928C90.8298 49.3179 90.9343 42.0625 88.5076 37.5101C80.6904 22.8561 66.5518 15.4287 53.9918 19.1558C52.6485 19.5551 51.3299 20.0486 50.059 20.6381C47.9889 9.24845 37.9332 1.53315 26.3551 2.68932C25.6119 2.76246 25.0745 3.42562 25.1493 4.16715C25.2293 4.91044 25.8903 5.45225 26.6335 5.37911C37.0667 4.33749 46.0755 11.5224 47.5409 21.9662ZM47.2001 25.4264C46.5885 25.8702 46.0002 26.346 45.4307 26.851C45.1279 27.123 44.5823 27.6584 44.2305 28.2446C44.1498 28.3825 44.0663 28.613 44.03 28.7204C44.3242 29.0148 44.572 29.193 44.8351 29.1567C45.1633 29.1136 45.4169 28.8351 45.6784 28.5165C46.3358 27.7174 46.8587 26.5393 47.2001 25.4264Z"
                fill="#5048E5"
              />
            </svg>

            <svg
              className="absolute left-[6rem] h-[150px] in-mobile-not-visible"
              viewBox="0 0 246 169"
              fill="none"
            >
              <path
                d="M4.64944 2.52011C4.64121 1.35343 3.68837 0.414321 2.5212 0.422539C1.35403 0.430756 0.414516 1.38319 0.422737 2.54987L4.64944 2.52011ZM245.48 136.609C245.83 135.497 245.212 134.311 244.099 133.96L225.956 128.252C224.842 127.901 223.655 128.519 223.305 129.632C222.955 130.745 223.573 131.932 224.687 132.281L240.814 137.356L235.736 153.476C235.387 154.589 236.004 155.776 237.118 156.126C238.231 156.476 239.418 155.858 239.768 154.745L245.48 136.609ZM2.53609 2.53499C0.422737 2.54987 0.422742 2.55059 0.42275 2.55157C0.422755 2.55225 0.422764 2.5535 0.422775 2.55485C0.422796 2.55757 0.422828 2.56134 0.42287 2.56616C0.422955 2.57579 0.423084 2.58961 0.423273 2.60755C0.423651 2.64343 0.424267 2.69581 0.425234 2.76425C0.427168 2.90113 0.430507 3.10226 0.436162 3.36406C0.447473 3.88764 0.46805 4.65401 0.505188 5.63456C0.579454 7.59542 0.719999 10.4142 0.985281 13.8618C1.51552 20.7528 2.54566 30.1765 4.54762 40.2934C6.54776 50.4009 9.52984 61.262 13.9885 70.9992C18.4399 80.7206 24.4314 89.4711 32.533 95.1706L34.9658 91.7154C27.7049 86.6074 22.1134 78.5912 17.8319 69.2408C13.5576 59.9063 10.6566 49.3912 8.69412 39.4735C6.73335 29.5651 5.7211 20.3147 5.19963 13.5377C4.93907 10.1514 4.80143 7.38776 4.72897 5.47472C4.69275 4.51832 4.67283 3.77486 4.66198 3.27285C4.65656 3.02186 4.6534 2.83125 4.65162 2.70459C4.65072 2.64127 4.65017 2.59393 4.64984 2.56304C4.64968 2.54759 4.64957 2.53625 4.64951 2.52908C4.64948 2.52549 4.64946 2.52295 4.64945 2.52145C4.64944 2.5207 4.64944 2.52049 4.64944 2.52011C4.64944 2.52004 4.64944 2.52011 2.53609 2.53499ZM32.533 95.1706C59.776 114.337 92.1773 118.87 118.465 101.706L116.154 98.1679C91.7216 114.121 61.2378 110.198 34.9658 91.7154L32.533 95.1706ZM118.465 101.706C123.943 98.129 128.375 91.4231 130.593 84.4451C132.799 77.5063 133.002 69.668 129.135 64.0057L125.644 66.388C128.459 70.5099 128.587 76.801 126.564 83.1657C124.554 89.4914 120.603 95.2636 116.154 98.1679L118.465 101.706ZM129.135 64.0057C125.017 57.9766 118.019 55.3928 110.943 55.2136C103.864 55.0343 96.3601 57.2336 90.7317 61.1972L93.1664 64.651C98.0187 61.2339 104.623 59.2799 110.836 59.4372C117.053 59.5947 122.536 61.8376 125.644 66.388L129.135 64.0057ZM90.7317 61.1972C74.4564 72.6593 70.6626 89.2151 73.6992 105.952C76.7144 122.571 86.4542 139.541 97.4879 152.599L100.717 149.872C89.9794 137.165 80.6989 120.855 77.8582 105.198C75.0389 89.6596 78.5539 74.942 93.1664 64.651L90.7317 61.1972ZM97.4879 152.599C106.821 163.644 120.936 167.99 136.423 168.521C151.92 169.052 169.106 165.781 185.05 161.245C201.016 156.703 215.856 150.855 226.694 146.15C232.117 143.796 236.546 141.725 239.623 140.24C241.16 139.498 242.361 138.903 243.179 138.491C243.587 138.286 243.901 138.126 244.113 138.017C244.22 137.963 244.3 137.922 244.355 137.893C244.382 137.879 244.403 137.868 244.417 137.861C244.425 137.858 244.43 137.854 244.434 137.852C244.436 137.852 244.438 137.851 244.439 137.85C244.439 137.849 244.44 137.849 243.464 135.976C242.488 134.102 242.488 134.102 242.487 134.102C242.486 134.103 242.485 134.103 242.484 134.104C242.481 134.106 242.477 134.107 242.471 134.111C242.458 134.118 242.439 134.127 242.414 134.139C242.364 134.166 242.287 134.205 242.186 134.257C241.983 134.362 241.678 134.516 241.279 134.717C240.481 135.119 239.301 135.704 237.785 136.436C234.752 137.9 230.375 139.947 225.011 142.275C214.278 146.934 199.621 152.707 183.893 157.181C168.142 161.663 151.436 164.808 136.568 164.298C121.69 163.788 108.969 159.637 100.717 149.872L97.4879 152.599Z"
                fill="#E58236"
              />
            </svg>
          </div>

          {/* Dashboard Image */}
          <div className="relative max-w-[1112px] mx-auto">
            <img
              src="/assets/Dashboard.png"
              alt="Dashboard Preview"
              className="w-full "
            />
          </div>
        </div>

        {/* Decorative Elements */}
      </section>

      {/* Logo Carousel */}
      <section className="py-16 bg-[#FCFFF4] horizontal-scroll-parent-in-inventory-management">
        <div className="max-w-7xl mx-auto px-16 scroll-of-horizontal-in-inventory-management">
          <p className="text-2xl font-['Sequel_Sans'] font-normal text-brand-dark text-center mb-12 trust-indecation-in-inventory-management">
            Trusted by 10+ industrial companies
          </p>

          <div className="flex items-center justify-center gap-10 overflow-hidden relative z-1 ">
            <HorizontalScroller
              data={[images]}
              isHoverable={false}
              renderCard={(partner: any, index) => (
                <div
                  key={index}
                  className={`w-[200px]  flex flex-col justify-center items-center gap-4`}
                  style={{ margin: "0 8px" }} // 8px horizontal margin (equivalent to mx-2)
                >
                  <div key={index} className="flex items-center">
                    <img
                      src={partner.logo}
                      className="w-[160px]"
                      alt={partner.name}
                    />
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section
        id="solution"
        className="py-20 bg-[#FCFFF4] problem-section-parent-in-inventory-management"
      >
        <div className="max-w-7xl mx-auto px-16 problem-section-content-holder-in-inventory-management">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-[5rem] heading-and-subtext-content-holder-in-inventory-management">
            <div>
              <h2 className="text-[52px] spradesheet-usage-text-in-inventory-management leading-[62.4px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] mb-8 -mt-3">
                Is your HR still manual?
              </h2>
            </div>
            <div className="flex items-center">
              <p className="text-lg font-['Sequel_Sans'] spradesheet-usage-subtext-in-inventory-management font-normal text-brand-dark leading-[25.2px]">
                PeopleMS automates your entire HR workflow - from attendance to
                payroll and employee queries - giving you real-time visibility,
                fewer errors, and smarter control, so your team can focus on
                people, not paperwork.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 justify-center items-center relative problem-section-cards-holder-in-inventory-management">
            <img
              src="assets/still-using-spradesheets-3-section-icon.svg"
              className="absolute -right-[4rem] -top-[4rem] in-mobile-not-visible"
              alt=""
            />
            <div
              className="rounded-3xl border-[1.5px] border-brand-dark bg-brand-bg p-6 hover:shadow-[8px_8px_0_0_#000]"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/missed-reorders-cause-production-delays.webp"
                alt="Production Delays"
                className="w-[100px] h-[89px] mb-6"
              />
              <h3 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark mb-3 leading-tight spradesheet-usage-card-title-text-in-inventory-management">
                Payroll errors slow you down
              </h3>
              <p className="text-base font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed spradesheet-usage-card-subtext-text-in-inventory-management">
                Automate salary calculations, taxes, and compliance to eliminate
                mistakes and last-minute payroll stress.
              </p>
            </div>

            <div
              className="rounded-3xl border-[1.5px] border-brand-dark bg-brand-bg p-6 hover:shadow-[8px_8px_0_0_#000]"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/manual-stock-traking-leads-to-costly-errors.webp"
                alt="Costly Errors"
                className="w-[88px] h-[88px] mb-6"
              />
              <h3 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark mb-3 leading-tight spradesheet-usage-card-title-text-in-inventory-management">
                Leave conflicts disrupt teams
              </h3>
              <p className="text-base font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed spradesheet-usage-card-subtext-text-in-inventory-management">
                Clear leave policies and approval workflows prevent confusion
                and miscommunication across teams.
              </p>
            </div>

            <div
              className="rounded-3xl border-[1.5px] border-brand-dark bg-brand-bg p-6 hover:shadow-[8px_8px_0_0_#000]"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/no-visibility-ito-row-material-movement.webp"
                alt="No Visibility"
                className="w-[89px] h-[90px] mb-6"
              />
              <h3 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark mb-3 leading-tight spradesheet-usage-card-title-text-in-inventory-management">
                Attendance data isn’t reliable
              </h3>
              <p className="text-base font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed spradesheet-usage-card-subtext-text-in-inventory-management">
                Track attendance in real time with accurate check-ins, shifts,
                and overtime - all in one dashboard.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 mt-8 lg:grid-cols-2 gap-8 justify-center  relative problem-section-cards-holder-in-inventory-management">
            <div
              className="rounded-3xl border-[1.5px] border-brand-dark bg-brand-bg p-6 hover:shadow-[8px_8px_0_0_#000]"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/HR-buried-in-repetitive-queries.webp"
                alt="No Visibility"
                className="w-[89px] h-[90px] mb-6"
              />
              <h3 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark mb-3 leading-tight spradesheet-usage-card-title-text-in-inventory-management">
                HR buried in repetitive queries
              </h3>
              <p className="text-base font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed spradesheet-usage-card-subtext-text-in-inventory-management">
                AI-powered employee self-service answers common HR questions
                instantly, reducing HR workload.
              </p>
            </div>
            <div
              className="rounded-3xl border-[1.5px] border-brand-dark bg-brand-bg p-6 hover:shadow-[8px_8px_0_0_#000]"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/No-visibility-into-workforce-data.webp"
                alt="No Visibility"
                className="w-[89px] h-[90px] mb-6"
              />
              <h3 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark mb-3 leading-tight spradesheet-usage-card-title-text-in-inventory-management">
                No visibility into workforce data
              </h3>
              <p className="text-base font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed spradesheet-usage-card-subtext-text-in-inventory-management">
                Access real-time reports and analytics to make faster,
                data-driven HR decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 bg-brand-purple overflow-hidden everything-you-need-text-in-inventory-management"
      >
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
              linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <div className="relative z-1 max-w-7xl mx-auto px-16 benfits-section-content-holder-in-inventory-management">
          <div className="text-center mb-[5rem] relative heading-content-holder-in-inventory-management">
            <h2
              style={{ color: "#F5F9F5" }}
              className="text-[52px] leading-[62.4px] font-['Sequel_Sans'] factory-floor-text-heading-in-inventory-management font-normal text-brand-bg tracking-[-1.04px] mb-4"
            >
              Everything you need to
              <br />
              run HR, smarter
            </h2>
            <img
              className="absolute -bottom-[2.5rem] right-[12rem] in-mobile-not-visible"
              src="assets/everything-you-need-to-run-section-area.svg"
              alt="everything-you-need-to-run-section-area"
            />
          </div>

          <FeatureSwitcher setOpen={setOpen} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-24 bg-[#FCFFF4] why-chose-people-ms-section">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-18 why-chose-people-ms-container">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 md:mb-16 gap-6 md:gap-8">
            <div className="max-w-[800px]">
              <h2 className="text-3xl md:text-[52px] why-chose-people-ms-heading-in-inventory-management font-['Sequel_Sans'] font-[420] text-[#0A0F0A] leading-[120%] tracking-[-1.04px] mb-4">
                Why choose PeopleMS?
              </h2>
              <p className="text-base md:text-[20px] why-chose-people-ms-subtext-in-inventory-management font-['Sequel_Sans'] font-[410] text-[#0A0F0A] leading-[140%]">
                Built to be secure, flexible, and scalable - PeopleMS adapts to
                your team as you grow.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="button video-section-button-in-inventory-management nav-links-in-inventory-management-get-in-touch type1 px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal  hover:bg-brand-purple/90 transition-colors w-full md:w-auto"
            >
              <span>Explore more</span>
            </button>
          </div>

          {/* Cards Grid with Fillet Effect */}
          <div className="relative mt-8 md:mt-12 overflow-hidden rounded-[12px] lg:rounded-none lg:overflow-visible">
            {/* Background container for the fillet borders */}
            <div className="flex flex-col lg:flex-row w-full bg-[#000000] lg:pt-[1.5px] gap-[1px] lg:gap-[2px]">
              {[
                {
                  icon: "/assets/99.9-Uptime.webp",
                  title: "99.9%\nUptime",
                  subtext:
                    "Enterprise-grade cloud infrastructure ensures your HR data is always available and protected.",
                },
                {
                  icon: "/assets/3-Level-Role-System.webp",
                  title: "3-Level\nRole System",
                  subtext:
                    "Admins, HR teams, and employees get clearly defined, permission-based access.",
                },
                {
                  icon: "/assets/40-fewer-HR-Tasks.webp",
                  title: "40% fewer\nHR Tasks",
                  subtext:
                    "Automation and AI-powered queries free HR teams from repetitive manual tasks.",
                },
                {
                  icon: "/assets/10x-Team-Growth-Ready.webp",
                  title: "10x Team\nGrowth Ready",
                  subtext:
                    "PeopleMS adapts as your workforce expands - without changing systems or workflows.",
                },
                {
                  icon: "/assets/go-Live-in-Hours.webp",
                  title: "Go Live in\nHours",
                  subtext:
                    "Set up your organization, add employees, and start running HR without long implementation cycles.",
                },
                {
                  icon: "/assets/100-Mobile-Ready.webp",
                  title: "100%\nMobile-Ready",
                  subtext:
                    "Manage attendance, leave, and approvals seamlessly from any device.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`
                    flex-1 pt-4 pb-4 px-4 xl:px-4 flex flex-col items-start justify-between bg-[#FCFFF4]
                    mb-[1.5px] lg:mb-0
                    ${index === 0 ? "lg:rounded-tr-[12px]" : ""}
                    ${index > 0 && index < 5 ? "lg:rounded-t-[12px]" : ""}
                    ${index === 5 ? "lg:rounded-tl-[12px]" : ""}
                  `}
                >
                  <div>
                    <div className="mb-6">
                      <img
                        src={feature.icon}
                        width={40}
                        height={40}
                        alt={feature.title}
                      />
                    </div>
                    <h3 className="text-[28px] why-chose-people-ms-feature-title-in-inventory-management font-['Sequel_Sans'] font-[420] text-[#0A0F0A] leading-[120%] tracking-[-0.56px] mb-4 whitespace-pre-line xl:min-h-[66px]">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-[16px] why-chose-people-ms-feature-subtext-in-inventory-management font-['Sequel_Sans'] font-[405] text-[#0A0F0A] leading-[140%]">
                    {feature.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      {/* <section
        id="demo"
        className="py-24 bg-[#FCFFF4] video-section-parent-in-inventory-management"
      >
        <div className="max-w-7xl mx-auto px-16 text-center video-section-content-holder-in-inventory-management">
          <h2 className="text-[52px] hidden lg:block spradesheet-usage-text-in-inventory-management leading-[62.4px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] mb-4">
            See How It Works
          </h2>
          <h2 className="text-[52px] block lg:hidden spradesheet-usage-text-in-inventory-management leading-[62.4px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] mb-4">
            Still using spreadsheets to track inventory?
          </h2>
          <p className="hidden lg:block text-xl font-['Sequel_Sans'] how-it-works-subtext-text-in-inventory-management font-normal text-brand-dark mb-12 max-w-[646px] mx-auto">
            Watch how our software simplifies your entire inventory workflow,
            from raw material purchase to production dispatch
          </p>
          <p className="text-xl block lg:hidden font-['Sequel_Sans'] video-section-subtext-text-in-inventory-management how-it-works-subtext-text-in-inventory-management font-normal text-brand-dark mb-12 max-w-[646px] mx-auto">
            See how our software streamlines your workflow
          </p>

          <button
            onClick={() => setOpen(true)}
            className="button video-section-button-in-inventory-management nav-links-in-inventory-management-get-in-touch nav-links-in-inventory-management-get-in-touch type1 px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal mb-[5rem] hover:bg-brand-purple/90 transition-colors"
          >
            <span>Schedule a Live Demo</span>
          </button>

          <div className="relative max-w-[1110px] mx-auto">
            <img
              src="assets/see-how-it-works-section-icon.svg"
              className="absolute -top-6 -right-[9rem] in-mobile-not-visible w-[120px] h-[120px] desktop-hide-in-small-desktop"
              alt=""
            />

            <div className="rounded-lg border-2 border-brand-dark bg-white shadow-[8px_8px_0_0_#000] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-brand-bg border-b-2 border-brand-dark rounded-t-lg">
                <div className="w-3 h-3 rounded-full bg-[#FF6259]" />
                <div className="w-3 h-3 rounded-full bg-[#FDB946]" />
                <div className="w-3 h-3 rounded-full bg-[#00D044]" />
              </div>
              <div className="relative aspect-video bg-gray-100">
                <img
                  src="assets/see-how-it-works-main-image.webp"
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                  <div className="circle-button w-[120px] h-[120px] play-button-in-video-in-inventory-management rounded-full bg-[#F5F9F5] border-[1.5px] border-brand-dark flex items-center justify-center hover:scale-105 transition-transform ">
                    <svg width="32" height="37" viewBox="0 0 32 37" fill="none">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M30.1378 16.983L1.58664 0.237396C1.32554 0.0829958 1.02893 0.00112152 0.726837 0H0.721837C0.419459 0.00121443 0.122837 0.0830958 -0.138529 0.237496C-0.401695 0.389996 -0.620129 0.610896 -0.771529 0.877396C-0.922929 1.14396 -1.00179 1.44669 -1 1.75446V35.2453C-1.00121 35.5533 -0.922196 35.8561 -0.771129 36.1231C-0.620063 36.3901 -0.402329 36.6118 -0.139796 36.7658C0.122804 36.9198 0.420737 37.0006 0.723804 37C1.02687 36.9994 1.32454 36.9175 1.58654 36.7624L30.1378 20.0168C30.3999 19.8631 30.6176 19.642 30.769 19.3757C30.9203 19.1094 31 18.8074 31 18.4999C31 18.1924 30.9203 17.8903 30.769 17.6241C30.6176 17.3578 30.3999 17.1367 30.1378 16.983Z"
                        fill="#5048E5"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* How it Works Section */}
      <HowItWorks />

      {/* Who is PeopleMS For Section */}
      <WhoIsPeopleMS />

      {/* Benefits Section */}
      {/* <section
        id="benefits"
        className="relative py-24 bg-brand-bg overflow-hidden why-manufactures-love-us-in-inventory-management"
      >
        <div className="relative z-1 max-w-7xl mx-auto px-16  benefits-section-content-holder-in-inventory-management">
          <img
            src="assets/why-manufacturers-love-us-love-icon.svg"
            className="absolute -top-6 right-[20%] w-[70px] h-[70px] in-mobile-not-visible love-icon-in-why-manufacturers-love-us-in-inventory-management"
            alt=""
          />
          <h2 className="text-[52px] why-manufacturers-love-us-header-in-inventory-management spradesheet-usage-text-in-inventory-management leading-[62.4px] font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] text-center mb-[5rem]">
            Why Manufacturers Love Us
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 benifits-section-content-holder-in-inventory-management">
            <div
              className="rounded-3xl benifits-card-in-inventory-management border-[1.5px] border-brand-dark bg-[#F6F5F4] hover:shadow-[8px_8px_0_0_#000] p-8"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/24x7-access-icon.webp"
                alt="24/7 Access"
                className="w-[100px] h-[102px] mb-6 benifits-icon-in-inventory-management"
              />
              <h3 className="text-[28px] benifits-header-in-inventory-management leading-[33.6px] why-manufacturers-love-us-header-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.56px] mb-4">
                24/7 Access
              </h3>
              <p className="text-lg font-['Sequel_Sans'] font-normal why-manufacturers-love-us-subheader-in-inventory-management text-brand-dark leading-relaxed">
                Your factory's data — always on, always secure. Access from
                anywhere with cloud-based, mobile-friendly control.
              </p>
            </div>

            <div
              className="rounded-3xl benifits-card-in-inventory-management border-[1.5px] border-brand-dark bg-[#F6F5F4] hover:shadow-[8px_8px_0_0_#000] p-8"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/customizable-workflows-icon.webp"
                alt="Customizable Workflows"
                className="w-[92px] h-[102px] mb-6 benifits-icon-in-inventory-management"
              />
              <h3 className="text-[28px] benifits-header-in-inventory-management leading-[33.6px] font-['Sequel_Sans'] why-manufacturers-love-us-header-in-inventory-management font-normal text-brand-dark tracking-[-0.56px] mb-4">
                Customizable Workflows
              </h3>
              <p className="text-lg font-['Sequel_Sans'] why-manufacturers-love-us-subheader-in-inventory-management font-normal text-brand-dark leading-relaxed">
                Every factory runs differently, and that's okay. Set up
                workflows that match your production style perfectly.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 actionaable-insights-section-in-inventory-management">
            <div
              className="rounded-3xl benifits-card-in-inventory-management border-[1.5px] border-brand-dark bg-[#F6F5F4] hover:shadow-[8px_8px_0_0_#000] p-8"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/actionaable-insights-icon.webp"
                alt="Actionable Insights"
                className="w-[113px] h-[102px] mb-6 benifits-icon-in-inventory-management"
              />
              <h3 className="text-[28px] benifits-header-in-inventory-management leading-[33.6px] font-['Sequel_Sans'] why-manufacturers-love-us-header-in-inventory-management font-normal text-brand-dark tracking-[-0.56px] mb-4">
                Actionable Insights
              </h3>
              <p className="text-lg font-['Sequel_Sans'] why-manufacturers-love-us-subheader-in-inventory-management font-normal text-brand-dark leading-relaxed">
                Turn complex production data into smart, AI-driven decisions.
              </p>
            </div>

            <div
              className="rounded-3xl benifits-card-in-inventory-management border-[1.5px] border-brand-dark bg-[#F6F5F4] hover:shadow-[8px_8px_0_0_#000] p-8"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/seamless-integraations-icon.webp"
                alt="Seamless Integrations"
                className="w-[94px] h-[98px] mb-6 benifits-icon-in-inventory-management"
              />
              <h3 className="text-[28px] benifits-header-in-inventory-management leading-[33.6px] font-['Sequel_Sans'] why-manufacturers-love-us-header-in-inventory-management font-normal text-brand-dark tracking-[-0.56px] mb-4">
                Seamless Integrations
              </h3>
              <p className="text-lg font-['Sequel_Sans'] font-normal why-manufacturers-love-us-subheader-in-inventory-management text-brand-dark leading-relaxed">
                Connect effortlessly with ERP, accounting, and vendor tools you
                already use.
              </p>
            </div>

            <div
              className="rounded-3xl benifits-card-in-inventory-management border-[1.5px] border-brand-dark bg-[#F6F5F4] hover:shadow-[8px_8px_0_0_#000]  p-8"
              style={{
                border: "2px solid #000",
              }}
            >
              <img
                src="assets/instent-alert-icon.webp"
                alt="Instant Alerts"
                className="w-[95px] h-[102px] mb-6 benifits-icon-in-inventory-management"
              />
              <h3 className="text-[28px] benifits-header-in-inventory-management leading-[33.6px] font-['Sequel_Sans'] why-manufacturers-love-us-header-in-inventory-management font-normal text-brand-dark tracking-[-0.56px] mb-4">
                Instant Alerts
              </h3>
              <p className="text-lg font-['Sequel_Sans'] why-manufacturers-love-us-subheader-in-inventory-management font-normal text-brand-dark leading-relaxed">
                Get real-time notifications for stock levels, defects, and
                production delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <TestimonialSlider />

      {/* Pricing Section */}
      {/* <section
        id="pricing"
        className="py-24 bg-[#FCFFF4] pricing-section-in-inventory-management pt-10 pb-50"
      >
        <div className="max-w-7xl mx-auto px-0 lg:px-8 2xl:px-0 pricing-section-content-holder-in-inventory-management">
          <h2 className="text-[52px] leading-[62.4px] spradesheet-usage-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-1.04px] text-center mb-4">
            Choose a Plan <br />
            That Fits Your Factory
          </h2>
          <p className="text-xl font-['Sequel_Sans'] pricing-section-subheading-in-inventory-management font-normal text-brand-dark text-center transformes-how-we-manage-production-subheader-in-inventory-management mb-[5rem]">
            Simple, transparent, and built for businesses of all sizes
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
            <div className="rounded-2xl border-[1.5px] border-brand-dark bg-[#EAEDE0] p-8 flex flex-col justify-between pricing-cards-holder-in-inventory-management">
              <p className="text-2xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.48px] mb-4 plan-name-in-inventory-management">
                Basic Plan
              </p>
              <h3 className="text-[28px] leading-[33.6px] font-['Sequel_Sans'] font-normal text-brand-dark mb-6 plan-heading-in-inventory-management">
                Best for Small Teams
              </h3>
              <p className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed mb-8 plan-subheading-in-inventory-management">
                Track stock, manage materials, and eliminate manual errors with
                core inventory tools.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="button2 type2 nav-links-in-inventory-management-get-in-touch w-full px-9 py-4 rounded-full border-[1.5px] border-brand-dark bg-brand-bg text-brand-dark font-['Sequel_Sans'] text-base font-normal hover:bg-brand-dark/5 transition-colors"
              >
                {" "}
                <span>Get Basic</span>
              </button>
            </div>

            <div className="rounded-2xl border-[1.5px] border-brand-dark bg-[#EAEDE0] justify-between pricing-cards-holder-in-inventory-management p-8 flex flex-col">
              <p className="text-2xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.48px] plan-name-in-inventory-management mb-6">
                Pro Plan
              </p>
              <h3 className="text-[28px] leading-[33.6px] font-['Sequel_Sans'] font-normal text-brand-dark mb-6 plan-heading-in-inventory-management">
                For Growing Manufacturers
              </h3>
              <p className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed mb-8 plan-subheading-in-inventory-management">
                Unlock automation, advanced analytics, and workflow insights to
                streamline every production stage.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="button w-full nav-links-in-inventory-management-get-in-touch px-9 py-4 rounded-full bg-brand-purple text-brand-bg font-['Sequel_Sans'] text-base font-normal hover:bg-brand-purple/90 transition-colors"
              >
                <span>Get Pro</span>
              </button>
            </div>

            <div className="rounded-2xl border-[1.5px] border-brand-dark justify-between pricing-cards-holder-in-inventory-management bg-[#EAEDE0] p-8 flex flex-col">
              <p className="text-2xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.48px] mb-6 plan-name-in-inventory-management">
                Enterprise Plan
              </p>
              <h3 className="text-[28px] leading-[33.6px] font-['Sequel_Sans'] font-normal text-brand-dark mb-6 plan-heading-in-inventory-management">
                For Large Scale Operations
              </h3>
              <p className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed mb-8 plan-subheading-in-inventory-management">
                Enjoy full customization, user management, dedicated support,
                and system integrations built for scale.
              </p>

              <button
                onClick={() => setOpen(true)}
                className="button2 type2 nav-links-in-inventory-management-get-in-touch w-full px-9 py-4 rounded-full border-[1.5px] border-brand-dark bg-brand-bg text-brand-dark font-['Sequel_Sans'] text-base font-normal hover:bg-brand-dark/5 transition-colors"
              >
                <span>Get Enterprise</span>
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="relative cta-section-in-inventory-management z-1 py-20 mx-16 mb-24 bg-[#FCFFF4] rounded-[32px] overflow-hidden  everything-you-need-text-in-inventory-management">
        <img
          src="assets/ready-to-take-control-of-your-inventory-left-icon.svg"
          className="absolute top-0 in-mobile-not-visible"
          alt=""
        />
        <div className="relative z-1 text-center max-w-3xl mx-auto px-8 cta-section-content-in-inventory-management">
          <h2 className="text-[52px] cta-section-title-in-inventory-management text-[#F5F9F5] leading-[62.4px] spradesheet-usage-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-bg tracking-[-1.04px] mb-6">
             Ready to transform <br /> your HR?
          </h2>
          <p className="text-xl text-[#F5F9F5] font-['Sequel_Sans'] font-normal text-brand-bg mb-12 subhading-ready-to-take-control-in-inventory-management">
            Stop chasing spreadsheets. <br /> Start managing people
            intelligently.
          </p>
          <img
            src="assets/ready-to-take-control-of-your-inventory-right-logo.svg"
            className="absolute top-[50%] -right-[5rem] in-mobile-not-visible"
            alt=""
          />
          <div className="flex items-center justify-center gap-6 mb-8 cta-section-button-holder-in-inventory-management">
            <button
              onClick={() => setOpen(true)}
              className="button2 type2 black-border-remover-in-inventory-management cta-section-button-in-inventory-management nav-links-in-inventory-management-get-in-touch px-9 bullets-ready-to-take-control-in-inventory-management py-4 rounded-full border-[1.5px] border-brand-bg bg-brand-bg text-brand-dark font-['Sequel_Sans'] text-base font-normal hover:bg-brand-bg/90 transition-colors"
            >
              <span>Book a Free Demo</span>
            </button>

            <button
              onClick={() => setOpen(true)}
              className="button type1 white-border-remover-in-inventory-management cta-section-button-in-inventory-management nav-links-in-inventory-management-get-in-touch px-9 bullets-ready-to-take-control-in-inventory-management py-4 rounded-full border-[1.5px]  text-brand-bg font-['Sequel_Sans'] text-base font-norma "
            >
              <span>Start a Free Trial</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-brand-bg cta-section-bullets-holder-in-inventory-management">
            <div className="flex items-center gap-2 cta-section-bullets-in-inventory-management">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path
                  d="M13.2524 19.4591C14.5777 18.9895 15.7792 18.2144 16.7954 17.2363C19.5934 15.1063 21.316 11.4172 20.4157 7.65441C20.8317 7.36123 21.2598 7.06192 21.7102 6.7521C21.9781 6.56761 22.0455 6.20171 21.8618 5.93456C21.6781 5.66741 21.3129 5.60004 21.0442 5.78299C20.7 6.01991 20.3735 6.24822 20.0502 6.47499C18.9818 3.5985 16.6394 1.05882 14.0056 0.299079C12.8164 -0.0429004 11.5108 -0.0807918 10.2134 0.13029C6.50669 -0.0779212 2.74549 2.07538 1.03899 5.43413C-0.767738 8.99037 -0.168605 13.6449 2.45083 16.6352C5.07026 19.6258 9.52996 20.7786 13.2524 19.4591ZM4.2909 5.0045C6.21155 2.14902 10.512 0.515207 13.6795 1.42893C16.0733 2.11978 18.1977 4.50885 19.0698 7.16833C18.2159 7.77688 17.4129 8.3598 16.6328 8.9276C15.3965 9.82704 14.1212 10.7548 12.64 11.7821L9.47016 8.61222C9.24051 8.38257 8.86849 8.38257 8.63884 8.61222C8.4092 8.84186 8.4092 9.21389 8.63884 9.44353L12.1555 12.9602C12.3549 13.1609 12.6718 13.1892 12.9041 13.0291C14.5721 11.8808 15.9714 10.8627 17.3248 9.87833C17.9876 9.39588 18.6622 8.90501 19.3731 8.39539C20.0717 12.4342 17.3435 16.3989 13.7002 17.5569C10.4416 18.5933 6.58812 17.3586 4.53739 14.6228C2.48666 11.8862 2.38332 7.84138 4.2909 5.0045Z"
                  fill="#F5F9F5"
                />
              </svg>
              <span className="text-sm text-[#F5F9F5] font-['Sequel_Sans'] font-normal">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-2 cta-section-bullets-in-inventory-management">
              <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
                <path
                  d="M13.2524 19.4591C14.5777 18.9895 15.7792 18.2144 16.7954 17.2363C19.5934 15.1063 21.316 11.4172 20.4157 7.65441C20.8317 7.36123 21.2598 7.06192 21.7102 6.7521C21.9781 6.56761 22.0455 6.20171 21.8618 5.93456C21.6781 5.66741 21.3129 5.60004 21.0442 5.78299C20.7 6.01991 20.3735 6.24822 20.0502 6.47499C18.9818 3.5985 16.6394 1.05882 14.0056 0.299079C12.8164 -0.0429004 11.5108 -0.0807918 10.2134 0.13029C6.50669 -0.0779212 2.74549 2.07538 1.03899 5.43413C-0.767738 8.99037 -0.168605 13.6449 2.45083 16.6352C5.07026 19.6258 9.52996 20.7786 13.2524 19.4591ZM4.2909 5.0045C6.21155 2.14902 10.512 0.515207 13.6795 1.42893C16.0733 2.11978 18.1977 4.50885 19.0698 7.16833C18.2159 7.77688 17.4129 8.3598 16.6328 8.9276C15.3965 9.82704 14.1212 10.7548 12.64 11.7821L9.47016 8.61222C9.24051 8.38257 8.86849 8.38257 8.63884 8.61222C8.4092 8.84186 8.4092 9.21389 8.63884 9.44353L12.1555 12.9602C12.3549 13.1609 12.6718 13.1892 12.9041 13.0291C14.5721 11.8808 15.9714 10.8627 17.3248 9.87833C17.9876 9.39588 18.6622 8.90501 19.3731 8.39539C20.0717 12.4342 17.3435 16.3989 13.7002 17.5569C10.4416 18.5933 6.58812 17.3586 4.53739 14.6228C2.48666 11.8862 2.38332 7.84138 4.2909 5.0045Z"
                  fill="#F5F9F5"
                />
              </svg>
              <span className="text-sm text-[#F5F9F5] font-['Sequel_Sans'] font-normal">
                Get started in under 24 hours
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 bg-brand-bg overflow-hidden pb-8 footer-section-background-image-in-inventory-management pt-[25%] -mt-[25%]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[728px] h-[706px] -left-[400px] top-0">
            <div className="w-full h-full rounded-full bg-brand-pink/80 blur-[273px]" />
          </div>
          <div className="absolute w-[395px] h-[384px] right-0 top-[230px]">
            <div className="w-full h-full rounded-full bg-brand-yellow/80 blur-[175px]" />
          </div>
        </div>

        <div className="relative z-1 max-w-7xl mx-auto px-16 footer-section-container-in-inventory-management">
          <div className="flex justify-between grid-cols-1 md:grid-cols-4 gap-0 lg:gap-12 mb-[5rem] footer-social-links-container-in-inventory-management">
            <div className="footer-section-logo-and-paragraph-holder w-[351px]">
              <div className="flex items-center gap-4 mb-6 -mt-8 third-eye-logo-in-inventory-management">
                <NextImage
                  width={239}
                  height={123}
                  src="/assets/footer-thired-eye-logo.png"
                  alt="Third Eye Logo"
                  className="w-[239px] h-[123px] "
                />
              </div>
              <p className="text-lg font-['Sequel_Sans'] font-normal text-brand-dark leading-relaxed footer-section-description-in-inventory-management">
                We build intelligent software tools that help businesses
                streamline operations, automate workflows, and scale smarter,
                across every industry.
              </p>
            </div>

            <div className="links-container-in-smart-inventory-management">
              <h4 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.4px] mb-6 footer-subtext-heading-in-inventory-management">
                Links
              </h4>
              <ul className="space-y-4 footer-subtext-list-in-inventory-management">
                <li className="footer-subtext-list-text-in-inventory-management">
                  <a
                    href="#features"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("features")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="underline-button text-lg footer-subtext-list-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark  footer-subtext-subhading-in-inventory-management"
                  >
                    Features
                  </a>
                </li>
                <li className="footer-subtext-list-text-in-inventory-management">
                  <a
                    href="#pricing"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="underline-button text-lg footer-subtext-list-text-in-inventory-management font-['Sequel_Sans'] font-normal text-brand-dark footer-subtext-subhading-in-inventory-management"
                  >
                    Pricing
                  </a>
                </li>
                <li className="footer-subtext-list-text-in-inventory-management">
                  <a
                    href="#demo"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById("demo")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="underline-button text-lg  font-['Sequel_Sans'] font-normal text-brand-dark footer-subtext-subhading-in-inventory-management"
                  >
                    Demo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() => setOpen(true)}
                    className="underline-button text-lg  font-['Sequel_Sans'] font-normal text-brand-dark footer-subtext-subhading-in-inventory-management"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="links-container-in-smart-inventory-management-2">
              <h4 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.4px] mb-6 footer-subtext-heading-in-inventory-management">
                Support
              </h4>
              <ul className="space-y-4">
                <li className="underline-button text-lg font-['Sequel_Sans'] footer-subtext-list-text-in-inventory-management font-normal text-brand-dark footer-subtext-subhading-in-inventory-management">
                  Email: hi@thirdeyegfx.in
                </li>
                <li className="underline-button text-lg font-['Sequel_Sans'] font-normal text-brand-dark footer-subtext-subhading-in-inventory-management">
                  Phone: +91 8041479167
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-['Sequel_Sans'] font-normal text-brand-dark tracking-[-0.4px] mb-6 footer-subtext-heading-in-inventory-management">
                Social Links
              </h4>
              <ul className="space-y-4">
                <li className="footer-subtext-list-text-in-inventory-management">
                  <a
                    href="#"
                    className="flex social-icon-hover footer-subtext-subhading-in-inventory-management items-center gap-2 text-lg font-['Sequel_Sans'] font-normal text-brand-dark "
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      className="flex-shrink-0 animated-svg"
                    >
                      <rect
                        x="0.375"
                        y="0.375"
                        width="31.25"
                        height="31.25"
                        rx="15.625"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M21.6454 10.7211C20.2462 9.327 18.3855 8.55892 16.4032 8.55811C12.3184 8.55811 8.99398 11.8665 8.99234 15.9328C8.99179 17.2327 9.33299 18.5016 9.98154 19.6201L8.93018 23.4418L12.8588 22.4162C13.9413 23.0039 15.1599 23.3136 16.4001 23.3139H16.4033C20.4876 23.3139 23.8123 20.0052 23.8139 15.9387C23.8147 13.968 23.0446 12.1151 21.6454 10.7211ZM16.4032 22.0684H16.4006C15.2954 22.0679 14.2114 21.7723 13.2656 21.2139L13.0408 21.081L10.7095 21.6896L11.3317 19.4276L11.1852 19.1956C10.5686 18.2196 10.2431 17.0915 10.2436 15.9333C10.2449 12.5535 13.0081 9.80375 16.4056 9.80375C18.0509 9.80429 19.5974 10.4427 20.7603 11.6014C21.9232 12.7601 22.5633 14.3003 22.5627 15.9383C22.5613 19.3184 19.7982 22.0684 16.4032 22.0684ZM19.7818 17.4773C19.5967 17.385 18.6863 16.9393 18.5165 16.8777C18.3469 16.8162 18.2233 16.7856 18.1 16.97C17.9765 17.1544 17.6217 17.5696 17.5136 17.6925C17.4055 17.8155 17.2976 17.8309 17.1124 17.7386C16.9272 17.6464 16.3306 17.4517 15.6233 16.8239C15.0729 16.3353 14.7013 15.7318 14.5932 15.5474C14.4853 15.3628 14.5923 15.2727 14.6744 15.1713C14.8749 14.9236 15.0756 14.6638 15.1373 14.5409C15.1991 14.4179 15.1681 14.3103 15.1218 14.2181C15.0756 14.1259 14.7053 13.2188 14.551 12.8497C14.4006 12.4905 14.248 12.539 14.1343 12.5334C14.0264 12.528 13.9029 12.5269 13.7794 12.5269C13.656 12.5269 13.4554 12.573 13.2856 12.7576C13.1159 12.9421 12.6376 13.3879 12.6376 14.2949C12.6376 15.202 13.3011 16.0783 13.3937 16.2013C13.4862 16.3243 14.6994 18.1856 16.5569 18.9838C16.9987 19.1738 17.3435 19.2871 17.6125 19.3721C18.0561 19.5123 18.4597 19.4925 18.7788 19.4451C19.1346 19.3921 19.8743 18.9992 20.0287 18.5688C20.183 18.1383 20.183 17.7694 20.1366 17.6925C20.0904 17.6156 19.9669 17.5696 19.7818 17.4773Z"
                        fill="currentColor"
                      />
                    </svg>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex social-icon-hover footer-subtext-subhading-in-inventory-management items-center gap-2 text-lg font-['Sequel_Sans'] font-normal text-brand-dark"
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      className="flex-shrink-0"
                    >
                      <rect
                        x="0.375"
                        y="0.375"
                        width="31.25"
                        height="31.25"
                        rx="15.625"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      />
                      <path
                        d="M22.9999 22.9997V17.8722C22.9999 15.3522 22.4574 13.4272 19.5174 13.4272C18.0999 13.4272 17.1549 14.1972 16.7699 14.9322H16.7349V13.6547H13.9524V22.9997H16.8574V18.3622C16.8574 17.1372 17.0849 15.9647 18.5899 15.9647C20.0774 15.9647 20.0949 17.3472 20.0949 18.4322V22.9822H22.9999V22.9997Z"
                        fill="currentColor"
                      />
                      <path
                        d="M9.22729 13.6553H12.1323V23.0003H9.22729V13.6553Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10.6799 9C9.75238 9 8.99988 9.7525 8.99988 10.68C8.99988 11.6075 9.75238 12.3775 10.6799 12.3775C11.6074 12.3775 12.3599 11.6075 12.3599 10.68C12.3599 9.7525 11.6074 9 10.6799 9Z"
                        fill="currentColor"
                      />
                    </svg>
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-dark/10 pt-8 footer-copyright-in-inventory-management">
            <p className="text-sm font-['Sequel_Sans'] font-normal text-brand-dark/80 text-center copyright-text-in-inventory-management">
              Copyright © 2025 Third Eye. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
