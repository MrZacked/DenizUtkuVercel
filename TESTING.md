# Testing

## Commands

Install the locked dependencies with `npm ci`. Then run:

```sh
npm run check
```

This runs lint, route type generation, TypeScript, the test suite and a production build. Stop any preview using the same `.next` directory before running a build. Start it again with `npm run start` once checks finish.

For shorter checks:

```sh
npm test
npm run test:watch
npm run typecheck
```

The tests use the built-in [Node test runner](https://nodejs.org/api/test.html). No extra test framework is needed. Type checking first generates route types so it also works on a clean checkout, following the [Next.js CLI guidance](https://nextjs.org/docs/app/api-reference/cli/next#next-typegen-options).

## What the suite checks

- Gallery controls, active examples, keyboard handlers and confidence filtering
- Color comparison controls, sample pairs and image metadata
- Decorative landscape markup, palette endpoints and responsive style rules
- Scroll frame scheduling, scene visibility, cleanup and reduced-motion branches
- Theme selection, native transition lifecycle, rapid clicks and fallback cleanup

Component tests run transpiled modules with mocked browser APIs and hooks. Some markup is also checked through server rendering. These tests do not exercise React hydration or a real browser. Palette tests check final color values, not every intermediate frame or text over a photograph. Passing tests do not establish a Core Web Vitals score or frame rate.

## Browser checklist

Run against a production build. Follow the [Vercel interface guidelines](https://vercel.com/design/guidelines) and record the browser, viewport and theme with each result.

- Check 320px, 390px, 760px, 761px and a wide desktop viewport in both themes. Look for clipped copy, horizontal overflow and artwork over text.
- Scroll from the hero through Experience, projects, About and Contact. Check section joins and the construction photo at different scroll positions.
- Switch themes while the hero, Experience and About are in view. Check that text stays readable throughout the switch. Test both a browser with native view transitions and one without them.
- Reload after choosing a theme. Also check a fresh browser profile with no saved choice to confirm the system preference is used.
- Tab through the skip link, navigation, theme control, galleries, range controls and contact links. Check visible focus and make sure no content stays hidden when focused.
- Use reduced motion before loading the page, then change it while the page is open. Confirm scrolling, reveals and theme changes respect the setting.
- Check image failures and the initial page without JavaScript. Main content should stay available and interactive samples should have a useful fallback.
- Check 200% zoom, mobile Safari and a screen reader. Confirm the sun, moon and landscape drawings are not announced as content.
- Measure a production build on a throttled connection and a real phone before making performance claims. Watch for layout shifts, unnecessary requests and dropped frames during scroll.

## Continuous checks

`.github/workflows/checks.yml` runs the same checks on Node 24 for pull requests and pushes to the main portfolio branches. It uses read-only repository permissions and does not deploy or write changes back to the repository. Type generation and the build still create ignored files on the runner.

Adding the file locally does not run it on GitHub. Local verification and browser results should be reported separately from a completed CI run.
