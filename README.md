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
node --test tests/*.test.mjs
npm run lint
npx tsc --noEmit
npm run build
```

Images are stored in `public/work` and served locally. Photo sources and licenses are in `public/licenses.txt`. Required photo credits also stay beside the project images.

Scroll effects use native browser APIs. Reduced motion keeps the page static and background movement is turned off on small screens.

The color theme follows the system setting until a visitor chooses light or dark mode. Section colors and local landscape artwork change together. Photo overlays keep light text for readability in either mode.
