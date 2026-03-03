"use client";
import "./global.css";

import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as Sonner } from "@/app/components/ui/sonner";
import { TooltipProvider } from "@/app/components/ui/tooltip";
import Index from "./pages/Index";
import ScrollProgressButton from "@/components/ui/ScrollProgressButton";

const page = () => (
  <div className="bg-[#FCFFF4]">
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ScrollProgressButton />
      <Index />
    </TooltipProvider>
  </div>
);

export default page;
