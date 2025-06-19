"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { socialMedia } from "@/data";
import MagicButton from "./MagicButton";

const Footer = () => {
  return (
    <footer className="w-full section-padding relative" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96 pointer-events-none">
        <img
          src="/footer-grid.svg"
          alt="grid"
          className="w-full h-full opacity-50"
        />
      </div>

      <div className="container-responsive relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="heading lg:max-w-[45vw] mb-6">
            Ready to take <span className="text-purple">your</span> digital
            presence to the next level?
          </h1>
          <p className="text-white-200 text-responsive-base max-w-2xl mb-8 leading-relaxed">
            Reach out to me today and let&apos;s discuss how I can help you
            achieve your goals.
          </p>
          <a href="mailto:denizutku1900@hotmail.com">
            <MagicButton
              title="Let's get in touch"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center responsive-gap border-t border-blue-900 pt-8">
          <div className="text-center lg:text-left">
            <div className="mb-2 text-blue font-bold text-responsive-xl">DENIZ UTKU ATEŞ</div>
            <div className="mb-2 text-white-200 text-responsive-base">Computer Engineering Student & Full Stack Developer</div>
            <div className="mb-2 text-white-200 text-responsive-sm">denizutku1900@hotmail.com &bull; Antalya, Turkey &bull; +05538567042</div>
          </div>

          <div className="flex items-center responsive-gap">
            {socialMedia.map((info) => (
              <div
                key={info.id}
                className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300 hover:border-blue-500 transition-colors duration-200"
              >
                <a href={info.link} target="_blank" rel="noopener noreferrer">
                  <img src={info.img} alt="social media" width={20} height={20} />
                </a>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-400 text-responsive-sm border-t border-blue-900 pt-6">
          Copyright © 2024 Deniz Utku Ateş. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
