import Image from "next/image";
import { ColorComparison } from "./color-comparison";
import { MotionEffects } from "./motion-effects";
import { ThemeToggle } from "./theme-toggle";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-shell header-inner">
          <a className="site-name" href="#top">
            Deniz Utku Ateş
          </a>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#experience">Experience</a>
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="page-title" data-motion-scene="horizon">
          <div className="hero-scene" aria-hidden="true">
            <div className="hero-layer hero-layer-sky" />
            <div className="hero-layer hero-layer-ridges" />
            <div className="hero-layer hero-layer-shore" />
          </div>
          <div className="site-shell hero-inner">
            <div className="hero-name">
              <p className="hero-role">Software developer in Antalya, Turkey</p>
              <h1 id="page-title">
                <span>Deniz Utku</span>
                <span>Ateş</span>
              </h1>
            </div>
            <div className="hero-intro">
              <p>
                At VERO Digital Solutions I work on a shared Python library,
                API tests and integrations between business systems. Outside
                work I build web apps and computer vision projects.
              </p>
              <div className="hero-actions">
                <a className="hero-project-link" href="#projects">
                  View projects <span aria-hidden="true">↘</span>
                </a>
                <a className="text-link" href="mailto:denizutku1900@hotmail.com">
                  Email me
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="site-shell">
            <div className="section-intro" data-reveal="copy">
              <h2 id="experience-title">Experience</h2>
              <p>Python tools, integrations and testing for construction software.</p>
            </div>

            <article className="experience-feature">
              <div className="experience-heading" data-motion-scene="photo">
                <div className="experience-backdrop" aria-hidden="true">
                  <Image
                    src="/work/construction-sunset.jpg"
                    alt=""
                    fill
                    sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) calc(100vw - 3rem), 1248px"
                  />
                </div>
                <div className="experience-heading-content" data-reveal="copy">
                  <p className="experience-date">Sep 2025 - Present</p>
                  <h3>Python Developer</h3>
                  <p className="experience-company">VERO Digital Solutions</p>
                  <p className="experience-lead">
                    I built the API testing project and made most of the changes
                    to our shared Python library. I also work on integrations,
                    reports and data imports for BauBuddy.
                  </p>
                </div>
              </div>
              <ul className="experience-points" role="list">
                <li>
                  <h4>API testing</h4>
                  <p>
                    I built and maintained the API testing project with pytest
                    and YAML. It checks responses across environments, keeps
                    authentication settings separate and runs in GitLab CI. I
                    also wrote the setup guide.
                  </p>
                </li>
                <li>
                  <h4>Shared Python library</h4>
                  <p>
                    I made most of the updates to our shared Python library. It
                    handles configuration, logging, application startup, API
                    access and data processing. I updated existing scripts to
                    use it.
                  </p>
                </li>
                <li>
                  <h4>Integrations and imports</h4>
                  <p>
                    I added REST and webhook features to ERP, HR and accounting
                    integrations. I worked on data mapping, validation, duplicate
                    handling and vehicle and work-order imports through CLI and
                    FastAPI.
                  </p>
                </li>
                <li>
                  <h4>HR and vehicle data</h4>
                  <p>
                    I worked on employee and attendance sync, including employee
                    matching and records with multiple breaks. I also improved
                    how vehicle trips matched work orders and time records,
                    including time-zone handling.
                  </p>
                </li>
                <li>
                  <h4>Reports and documents</h4>
                  <p>
                    I built Excel reports for employee hours, project reporting
                    and material lists. I checked them against existing reports,
                    worked on payroll exports and made PDF parsers and structured
                    file imports.
                  </p>
                </li>
                <li>
                  <h4>Other tools and quality</h4>
                  <p>
                    I built CLI and FastAPI tools for translating text and
                    software language files, with input checks and caching. I
                    also updated build tools, wrote unit and regression tests
                    and made test and code-quality results easier to review.
                  </p>
                </li>
              </ul>
            </article>

            <div className="earlier-work" data-reveal="copy">
              <h3>Earlier experience</h3>
              <div className="earlier-work-grid">
                <article>
                  <p className="experience-date">Jan 2024 - Mar 2024</p>
                  <div>
                    <h4>Digital Image Processing Intern</h4>
                    <p>Bulutsoft</p>
                  </div>
                  <p>Worked on computer vision and image processing projects.</p>
                </article>
                <article>
                  <p className="experience-date">Jul 2023 - Sep 2023</p>
                  <div>
                    <h4>Full Stack Developer Intern</h4>
                    <p>Bulutsoft</p>
                  </div>
                  <p>Worked on web applications and REST APIs.</p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section projects-section" id="projects" aria-labelledby="projects-title">
          <div className="site-shell">
            <div className="section-intro" data-reveal="copy">
              <h2 id="projects-title">Projects</h2>
              <p>A few things I made outside work.</p>
            </div>

          <article className="project project-detection">
            <figure className="project-figure detection-figure">
              <div className="project-image" data-reveal="image">
                <Image
                  src="/work/object-detection.jpg"
                  alt="Cat resting on a bench with detection boxes added to the photo"
                  fill
                  sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1000px) calc(55vw - 2.75rem), (max-width: 1296px) calc(64vw - 2rem), 800px"
                />
              </div>
              <figcaption>
                I used a photo by{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Cat_on_a_bench_near_Sultanahmet_Meydan%C4%B1,_Istanbul,_20260605_0902_0926.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jakub Hałun
                </a>
                {" "}(
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
                  CC BY 4.0
                </a>
                ) and added the detection boxes.
              </figcaption>
            </figure>
            <div className="project-copy" data-reveal="copy" data-reveal-delay="100">
              <h3>Object detection</h3>
              <p>
                I built a Streamlit app that uses pretrained YOLO models to
                find objects in images, video and webcam feeds. The project
                also has scripts for training models.
              </p>
              <p className="project-tools">Python / YOLO / OpenCV / Streamlit</p>
              <a
                className="project-link"
                href="https://github.com/MrZacked/ZackedObjectDetection"
                target="_blank"
                rel="noopener noreferrer"
              >
                YOLO code
              </a>
            </div>
          </article>

          <article className="project project-healem">
            <figure className="healem-figure">
              <div className="healem-image" data-reveal="image">
                <Image
                  src="/work/healem-room.webp"
                  alt="Pale upholstered chairs with wooden frames in a sunlit room"
                  fill
                  sizes="(max-width: 520px) 100vw, (max-width: 760px) calc(100vw - 2rem), (max-width: 1296px) 42vw, 520px"
                />
              </div>
            </figure>
            <div className="healem-content" data-reveal="copy" data-reveal-delay="100">
              <p className="project-kind">Demo web app</p>
              <h3>Healem</h3>
              <p className="healem-description">
                A health management app with different user roles, appointments,
                messaging and APIs for health records.
              </p>
              <p className="project-tools">React / Node.js / Express / MongoDB / Docker</p>
              <a
                className="project-link"
                href="https://github.com/MrZacked/Healem"
                target="_blank"
                rel="noopener noreferrer"
              >
                Healem code
              </a>
            </div>
          </article>

          <article className="project project-colorization">
            <div className="colorization-heading" data-reveal="copy">
              <div>
                <h3>Colorization</h3>
                <p>
                  A command-line tool I made to colorize folders of grayscale
                  photos. It uses OpenCV and a pretrained model.
                </p>
              </div>
              <div>
                <p className="project-tools">Python / OpenCV / NumPy</p>
                <a
                  className="project-link"
                  href="https://github.com/MrZacked/ColorizationPython"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Colorization code
                </a>
              </div>
            </div>
            <figure className="colorization-figure">
              <ColorComparison />
              <figcaption>
                {"I used Güldem Üstün's photo, “"}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Izmir-Urla_Late_evening_street_view.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Turkey (Izmir-Urla) Late evening street view
                </a>
                {"” ("}
                <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">
                  CC BY 2.0
                </a>
                ). I resized it, made the grayscale input and ran it through my
                tool with a{" "}
                <a href="https://github.com/richzhang/colorization" target="_blank" rel="noopener noreferrer">
                  pretrained model
                </a>
                . The colors are estimates.
              </figcaption>
            </figure>
          </article>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title" data-motion-scene="print">
          <div className="site-shell about-inner">
            <div className="section-intro" data-reveal="copy">
              <h2 id="about-title">About</h2>
            </div>
            <div className="about-copy" data-reveal="copy" data-reveal-delay="90">
              <p>
                I graduated from Antalya Bilim University in 2025 with a BSc in
                Computer Engineering. My GPA was 3.76 and I ranked in the top
                three in my department.
              </p>
              <div className="about-tools">
                <h3>Tools I use</h3>
                <p>Python, FastAPI, pytest, Docker, Git, SQL, React and TypeScript.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <MotionEffects />

      <footer className="contact" id="contact">
        <div className="site-shell contact-inner">
          <div>
            <h2>Get in touch</h2>
            <p>You can email me about a role or a project.</p>
          </div>
          <div className="contact-links">
            <a href="mailto:denizutku1900@hotmail.com">Email</a>
            <a
              href="https://www.linkedin.com/in/deniz-utku-ate%C5%9F-801b76271/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a href="https://github.com/MrZacked" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="/Deniz_Utku_Ates_Resume.pdf" download>
              Download CV
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
