export const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Experience", link: "#experience" },
  { name: "Contact", link: "#contact" },
];

export const gridItems = [
  {
    id: 1,
    title: "I focus on clear communication and teamwork with clients",
    description: "",
    className: "lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]",
    imgClassName: "w-full h-full",
    titleClassName: "justify-end",
    img: "/b1.svg",
    spareImg: "",
  },
  {
    id: 2,
    title: "I'm very flexible with time zone communications",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "",
    spareImg: "",
  },
  {
    id: 3,
    title: "My tech stack",
    description: "I constantly try to improve",
    className: "lg:col-span-2 md:col-span-3 md:row-span-2",
    imgClassName: "",
    titleClassName: "justify-center",
    img: "",
    spareImg: "",
  },
  {
    id: 4,
    title: "Tech enthusiast with a passion for development.",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-start",
    img: "/grid.svg",
    spareImg: "/b4.svg",
  },
  {
    id: 5,
    title: "Working on AI/ML projects and web development",
    description: "The Inside Scoop",
    className: "md:col-span-3 md:row-span-2",
    imgClassName: "absolute right-0 bottom-0 md:w-96 w-60",
    titleClassName: "justify-center md:justify-start lg:justify-center",
    img: "/b5.svg",
    spareImg: "/grid.svg",
  },
  {
    id: 6,
    title: "Do you want to start a project together?",
    description: "",
    className: "lg:col-span-2 md:col-span-3 md:row-span-1",
    imgClassName: "",
    titleClassName: "justify-center md:max-w-full max-w-60 text-center",
    img: "",
    spareImg: "",
  },
];

export interface Project {
  id: number;
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Sticky Tasks - Full-Stack Todo Application",
    des: "Built a task management web application using MERN stack with TypeScript. Users can create tasks with priorities and due dates, filter by status, and view completion statistics. Implemented RESTful API with MongoDB aggregation for data processing. Features include task categorization, deadline tracking, progress analytics, and responsive design.",
    img: "/p4.svg",
    iconLists: ["/re.svg", "/ts.svg", "/app.svg", "/c.svg"],
    link: "https://github.com/MrZacked"
  },
  {
    id: 2,
    title: "Object Detection Web App",
    des: "Real-time detection using YOLOv8, v11 + Streamlit. Supported batch/live camera input with 80+ classes. Built an object detection system with PyTorch for real-time image and video analysis. Implemented web interface for interactive detection, supporting multiple model variants with configurable confidence thresholds.",
    img: "/p4.svg",
    iconLists: ["/app.svg", "/c.svg", "/stream.svg", "/git.svg"],
    link: "https://github.com/MrZacked"
  },
  {
    id: 3,
    title: "ChatApp – Real-Time Communication",
    des: "React + TypeScript + Fastify-based app with messaging, login, and presence features. Developed a real-time chat application with user login, messaging, and online presence features.",
    img: "/p1.svg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/next.svg"],
    link: "https://github.com/MrZacked"
  },
  {
    id: 4,
    title: "Foodagram - AI Food Recognition",
    des: "Built an AI-backed food photo verification system that detects if uploaded images are of food and verifies them against given food names. Utilized ResNet50, zero-shot classification, and cosine similarity-based feature vector comparisons. Extended with video-based verification for both frontend and API layers.",
    img: "/p2.svg",
    iconLists: ["/app.svg", "/c.svg", "/re.svg", "/next.svg"],
    link: "https://github.com/MrZacked"
  },
  {
    id: 5,
    title: "Fitness Tracker App",
    des: "Fitness tracking app to monitor activities, goals, and progress. Features dashboard with charts and stats, activity cards, friends list, and responsive UI. Built with React and Node.js.",
    img: "/p3.svg",
    iconLists: ["/re.svg", "/tail.svg", "/ts.svg", "/node.svg"],
    link: "https://github.com/MrZacked"
  }
];

export const testimonials = [
  // Educational achievements and recognition can be added here
];

export const companies = [
  {
    id: 1,
    name: "react",
    img: "/re.svg",
    nameImg: "/re.svg",
  },
  {
    id: 2,
    name: "app",
    img: "/app.svg", 
    nameImg: "/app.svg",
  },
  {
    id: 3,
    name: "javascript",
    img: "/js.svg",
    nameImg: "/js.svg",
  },
  {
    id: 4,
    name: "typescript",
    img: "/ts.svg",
    nameImg: "/ts.svg",
  },
  {
    id: 5,
    name: "docker",
    img: "/dock.svg",
    nameImg: "/dockerName.svg",
  },
];

export const workExperience = [
  {
    id: 1,
    title: "Full Stack Developer Intern",
    desc: "Built full-stack applications using modern web technologies. Worked on both backend and frontend of live projects, implementing user authentication, CRUD operations, RESTful APIs, and responsive UIs.",
    className: "md:col-span-2",
    thumbnail: "/exp1.svg",
    company: "Bulutsoft",
    duration: "Jul 2023 – Sep 2023"
  },
  {
    id: 2,
    title: "Digital Image Processing Intern", 
    desc: "Worked on computer vision applications using deep learning. Designed and trained neural network models with TensorFlow and PyTorch for object and face recognition. Used ResNet architectures to extract feature vectors for classification and verification.",
    className: "md:col-span-2",
    thumbnail: "/exp2.svg",
    company: "Bulutsoft", 
    duration: "Jan 2024 – Mar 2024"
  }
];

export const socialMedia = [
  {
    id: 1,
    img: "/git.svg",
    link: "https://github.com/MrZacked"
  },
  {
    id: 2,
    img: "/link.svg",
    link: "mailto:denizutku1900@hotmail.com"
  }
];
