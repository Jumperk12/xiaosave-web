"use client";

import { useState, useEffect } from "react";
import { Link2, Search, Download } from "lucide-react";

export default function InstructionCarousel() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Link2 size={40} className="text-[#ff3b30]" />,
      title: "Step 1: Copy the Link",
      description: "Open the RedNote (Xiaohongshu) app and find the video you want. Tap the share icon and select 'Copy Link'.",
    },
    {
      icon: <Search size={40} className="text-[#007aff]" />,
      title: "Step 2: Paste and Analyze",
      description: "Paste the link into Xiaosave and click 'Analyze Link'. We will instantly process the video and audio formats.",
    },
    {
      icon: <Download size={40} className="text-[#34c759]" />,
      title: "Step 3: Save to Device",
      description: "Choose your preferred format (HD Video, 480p, or MP3). The file will download directly to your device without any watermarks!",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-md mx-auto mt-12 mb-4 bg-[#1c1c1e] rounded-3xl p-6 shadow-lg border border-gray-800">
      <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[180px]">
        {/* Animated Icon Container */}
        <div 
          key={currentStep} 
          className="animate-in zoom-in duration-300 bg-[#2c2c2e] p-4 rounded-full shadow-inner"
        >
          {steps[currentStep].icon}
        </div>

        {/* Text Content */}
        <div key={`text-${currentStep}`} className="animate-in slide-in-from-right-4 fade-in duration-300">
          <h3 className="text-white font-bold text-lg mb-2">{steps[currentStep].title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed px-2">
            {steps[currentStep].description}
          </p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-2 mt-6">
        {steps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentStep === index ? "w-6 bg-white" : "w-2 bg-gray-600 hover:bg-gray-500"
            }`}
            aria-label={`Go to step ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
