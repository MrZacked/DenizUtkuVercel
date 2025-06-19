"use client";

import { useEffect, useRef } from "react";
import { FaLocationArrow } from "react-icons/fa6";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      container.style.setProperty("--x", `${x * 100}%`);
      container.style.setProperty("--y", `${y * 100}%`);
    };

    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-content-height pb-20 pt-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 min-h-[40vh]"
          fill="white"
        />
        <Spotlight
          className="min-h-[30vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 min-h-[30vh] w-[50vw]" fill="blue" />
        <div
          className="absolute inset-0 w-full h-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2] z-0 pointer-events-none"
        >
          <div
            className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          />
        </div>
      </div>
      <div className="flex justify-center relative z-10 min-content-height items-center">
        <div className="container-responsive flex flex-col items-center justify-center text-center w-full">
          <h1 className="text-responsive-2xl md:text-5xl lg:text-6xl font-bold text-blue mb-2 md:mb-4 break-words w-full">
            DENIZ UTKU ATEŞ
          </h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-2 md:gap-4 w-full mb-2 md:mb-4">
            <span className="text-responsive-base text-gray-300 break-words">denizutku1900@hotmail.com</span>
            <span className="hidden md:inline text-gray-400">&bull;</span>
            <span className="text-responsive-base text-gray-300 break-words">Antalya, Turkey</span>
            <span className="hidden md:inline text-gray-400">&bull;</span>
            <span className="text-responsive-base text-gray-300 break-words">+05538567042</span>
          </div>
          <a 
            href="https://github.com/MrZacked" 
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 mb-4 md:mb-6 text-responsive-base break-all" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            https://github.com/MrZacked
          </a>
          <div className="mb-4 md:mb-6 max-w-4xl w-full">
            <TextGenerateEffect
              words="Computer Engineer · AI/ML & Full Stack Developer"
              className="text-center text-responsive-xl md:text-3xl lg:text-4xl w-full"
            />
          </div>
          <p className="text-center max-w-3xl mb-6 md:mb-8 text-responsive-base text-gray-200 leading-relaxed card-padding w-full">
            Computer Engineering student at Antalya Bilim University (GPA 3.76, Top 3). Proficient in AI/ML and full stack development. Building practical solutions with modern web and machine learning technologies.
          </p>
          <a href="#about" className="scroll-smooth">
            <MagicButton
              title="See my projects"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
