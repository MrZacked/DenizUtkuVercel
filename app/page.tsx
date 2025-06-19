"use client";

import dynamic from "next/dynamic";

import { navItems } from "@/data";

// Dynamic imports to prevent SSR issues
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Grid = dynamic(() => import("@/components/Grid"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const Approach = dynamic(() => import("@/components/Approach"), { ssr: false });
const Experience = dynamic(() => import("@/components/Experience"), { ssr: false });
const RecentProjects = dynamic(() => import("@/components/RecentProjects"), { ssr: false });
const FloatingNav = dynamic(() => import("@/components/ui/FloatingNavbar").then(mod => ({ default: mod.FloatingNav })), { ssr: false });

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <div className="pt-20">
        <Hero />
        </div>
        <div id="about" className="scroll-mt-20">
        <Grid />
        </div>
        <div id="projects" className="scroll-mt-20">
        <RecentProjects />
        </div>
        <div id="experience" className="scroll-mt-20">
        <Experience />
        </div>
        <div id="contact" className="scroll-mt-20">
        <Footer />
        </div>
      </div>
    </main>
  );
};

export default Home;
