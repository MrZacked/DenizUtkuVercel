import Image from "next/image";
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

      <main id="main">
        <section className="hero site-shell" id="top" aria-labelledby="page-title">
          <div className="hero-name">
            <p className="hero-role">Software developer in Antalya, Turkey</p>
            <h1 id="page-title">
              <span>Deniz Utku</span>
              <span>Ateş</span>
            </h1>
          </div>
          <div className="hero-intro">
            <p>
              At VERO Digital Solutions I work on a shared Python library, API
              tests and integrations between business systems. I also build web
              apps and computer vision projects in my own time.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View projects
              </a>
              <a className="text-link" href="mailto:denizutku1900@hotmail.com">
                Email me
              </a>
            </div>
          </div>
        </section>

        <section className="site-shell section experience-section" id="experience" aria-labelledby="experience-title">
          <div className="section-intro">
            <h2 id="experience-title">Experience</h2>
          </div>

          <article className="experience-feature">
            <div className="experience-heading">
              <p className="experience-date">Sep 2025 - Present</p>
              <h3>Python Developer</h3>
              <p className="experience-company">VERO Digital Solutions</p>
            </div>
            <ul className="experience-points">
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
                Built REST and webhook integrations for ERP, HR and accounting
                systems. Worked on data mapping, validation and duplicate
                handling.
              </li>
              <li>
                Added vehicle and work-order imports through CLI and FastAPI,
                including business rules and contact mapping.
              </li>
              <li>
                Built Excel reports for employee hours, project reporting and
                material lists. Checked the results against existing reports
                and worked on payroll exports.
              </li>
              <li>
                Built PDF parsers and structured file imports. Wrote unit and
                regression tests and documented the work.
              </li>
            </ul>
          </article>

          <div className="earlier-work">
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
        </section>

        <section className="site-shell section projects-section" id="projects" aria-labelledby="projects-title">
          <div className="section-intro">
            <h2 id="projects-title">Projects</h2>
          </div>

          <article className="project project-detection">
            <figure className="project-figure detection-figure">
              <div className="project-image">
                <Image
                  src="/work/object-detection.jpg"
                  alt="Object detection result on a photograph of a cat resting on a bench"
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
            <div className="project-copy">
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
                View the repository
              </a>
            </div>
          </article>

          <article className="project project-healem">
            <div>
              <p className="project-kind">Demo web app</p>
              <h3>Healem</h3>
            </div>
            <div className="healem-copy">
              <p>
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
                View the repository
              </a>
            </div>
          </article>

          <article className="project project-colorization">
            <div className="colorization-heading">
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
                  View the repository
                </a>
              </div>
            </div>
            <figure className="colorization-figure">
              <div className="comparison">
                <div>
                  <div className="comparison-image">
                    <Image
                      src="/work/color-input.jpg"
                      alt="Grayscale view of a street in Urla, İzmir"
                      fill
                      sizes="(max-width: 520px) calc(100vw - 2rem), (max-width: 760px) calc(50vw - 1.4rem), (max-width: 1296px) calc(50vw - 1.9rem), 38.6rem"
                    />
                  </div>
                  <span>Grayscale input</span>
                </div>
                <div>
                  <div className="comparison-image">
                    <Image
                      src="/work/color-output.jpg"
                      alt="The same Urla street with colors estimated by the model"
                      fill
                      sizes="(max-width: 520px) calc(100vw - 2rem), (max-width: 760px) calc(50vw - 1.4rem), (max-width: 1296px) calc(50vw - 1.9rem), 38.6rem"
                    />
                  </div>
                  <span>Estimated color</span>
                </div>
              </div>
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
        </section>

        <section className="site-shell section about-section" id="about" aria-labelledby="about-title">
          <div className="section-intro">
            <h2 id="about-title">About</h2>
          </div>
          <div className="about-grid">
            <p>
              I graduated from Antalya Bilim University in 2025 with a BSc in
              Computer Engineering. My GPA was 3.76 and I ranked in the top
              three in my department.
            </p>
            <div>
              <h3>Tools I use</h3>
              <p>Python, FastAPI, pytest, Docker, Git, SQL, React and TypeScript.</p>
            </div>
          </div>
        </section>
      </main>

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
