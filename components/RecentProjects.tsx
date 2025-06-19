"use client";

import { FaLocationArrow } from "react-icons/fa6";
import Image from "next/image";

const projects = [
  {
    title: "ChatApp Website",
    description:
      "Developed a real-time chat application with user login, messaging, and online presence features. Built with React, TypeScript, and Fastify.",
    link: "https://github.com/MrZacked",
    technologies: ["React", "TypeScript", "Fastify", "Real-time messaging"]
  },
  {
    title: "Foodagram",
    description:
      "Built an AI-backed food photo verification system that detects if uploaded images are of food and verifies them against given food names. Utilized ResNet50, zero-shot classification, and cosine similarity-based feature vector comparisons. The system was extended with support for video-based verification, enabling both frontend and API layers to analyze video frames. Users can create video posts, and the app checks whether they visually match food-related content using AI. It includes features like pagination and infinite scroll for smoother browsing and direct media upload from camera, enhancing real-time interaction. The app also renders content in tag pages and supports a full photo/video feed experience.",
    link: "https://github.com/MrZacked",
    technologies: ["Python", "ResNet50", "AI/ML", "Computer Vision", "Video Processing"]
  },
  {
    title: "Fitness Tracker App",
    description:
      "A modern fitness tracking app to monitor your activities, goals, and progress. Features include a dashboard with charts and stats, activity cards, friends list, and a clean, responsive UI. Built using React and Node.js.",
    link: "https://github.com/MrZacked",
    technologies: ["React", "Node.js", "Charts", "Responsive Design"]
  },
];

const RecentProjects = () => {
  return (
    <section className="section-padding" id="projects">
      <div className="container-responsive">
        <h2 className="heading mb-12">PROJECTS</h2>
        <div className="space-y-8">
          {projects.map((project, idx) => (
            <div key={idx} className="bg-black/40 rounded-xl card-padding border border-blue-900 hover:border-blue-700 transition-colors duration-300">
              <h3 className="text-responsive-xl font-semibold text-blue mb-4">{project.title}</h3>
              <p className="text-gray-200 mb-6 leading-relaxed text-responsive-base">{project.description}</p>
              <div className="mb-6">
                <h4 className="text-responsive-lg font-semibold text-blue-100 mb-3">Technologies Used:</h4>
                <div className="flex flex-wrap responsive-gap">
                  {project.technologies.map((tech, techIdx) => (
                    <span key={techIdx} className="px-3 py-1 bg-blue-900/30 text-blue-200 text-sm rounded-full border border-blue-700 hover:bg-blue-800/40 transition-colors duration-200">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <a href={project.link} className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2 text-responsive-base font-medium transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                View on GitHub <FaLocationArrow className="w-3 h-3" />
              </a>
            </div>
          ))}
          <div className="mt-8 card-padding bg-blue-900/20 rounded-xl border border-blue-800">
            <p className="text-gray-300 mb-4 text-responsive-base">For other face recognition, AI projects and more please visit my GitHub:</p>
            <a href="https://github.com/MrZacked" className="text-blue-400 hover:text-blue-300 font-semibold text-responsive-lg transition-colors duration-200" target="_blank" rel="noopener noreferrer">
              https://github.com/MrZacked
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentProjects;
