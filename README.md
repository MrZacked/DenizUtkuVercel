# Deniz Utku Ateş

Personal portfolio at [denizutkuates.com](https://denizutkuates.com), built with Next.js, TypeScript and CSS.

## Run locally

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). For a local production run, use `npm run build` followed by `npm run start`.

The public CV is in `public/Deniz_Utku_Ates_Resume.pdf`. To rebuild it after a content change, run `python3 scripts/build_resume.py` with ReportLab installed. This copy leaves out the phone number.

## Checks

```sh
npm run check
```

This runs lint, route type generation, TypeScript, tests and a production build. Use `npm test` for tests alone or `npm run test:watch` while working. See [TESTING.md](TESTING.md) for test coverage and browser checks.

Images are stored in `public/work` and served locally. Photo sources and licenses are in `public/licenses.txt`. Required photo credits also stay beside the project images.

Scroll effects use native browser APIs. Reduced motion keeps the page static and smaller screens use less background movement.

Detection and colorization have manual galleries. Only the active example is rendered. Detection uses saved predictions from the Python project with a confidence filter, not live inference. Colorization compares saved input and output pairs. Generation details are in `public/work/sample-notes.txt`. Neither feature uploads visitor images or loads a model into the browser.

The color theme follows the system setting until a visitor chooses light or dark mode. Section colors and local landscape artwork change together. Photo overlays use dark text in light mode and light text in dark mode.
