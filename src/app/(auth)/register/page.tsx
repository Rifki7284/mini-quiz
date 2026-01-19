"use client"
import { RegisterForm } from "@/components/layout/RegisterForm";
import Lottie from "lottie-react";
import { Book } from "lucide-react";
import { useEffect, useState } from "react";

const Page = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/Books.json")
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-[#E95B0F] text-white flex size-8 items-center justify-center rounded-lg">
              <Book className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[#E95B0F]">
                Quiz App
              </span>
              <span className="text-xs text-[#012F61] font-medium">
                Learning Platform
              </span>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-[#E95B0F]/20 to-[#012F61]/20 relative hidden lg:flex items-center justify-center p-8">
        {animationData && (
          <div className="w-full max-w-md flex items-center justify-center">
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{
                width: "100%",
                height: "auto",
                maxWidth: 300,
                minWidth: 200,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
