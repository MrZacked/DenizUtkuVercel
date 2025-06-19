import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        black: {
          DEFAULT: "#000",
          100: "#000319",
          200: "rgba(17, 25, 40, 0.75)",
          300: "rgba(255, 255, 255, 0.125)",
        },
        white: {
          DEFAULT: "#FFF",
          100: "#BEC1DD",
          200: "#C1C2D3",
        },
        blue: "#0070f3",
        "blue-100": "#e6f1fe",
        "blue-200": "#cce3fd",
        "blue-300": "#99c7fb",
        "blue-400": "#66abf9",
        "blue-500": "#338ff7",
        "blue-600": "#0070f3",
        "blue-700": "#005bc4",
        "blue-800": "#004696",
        "blue-900": "#003068",
        purple: "#CBACF9",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-500px)",
            opacity: "0",
          },
        },
        "text-gradient": {
          to: {
            backgroundPosition: "200% center",
          },
        },
        "border-width": {
          from: {
            width: "10px",
            opacity: "0",
          },
          to: {
            width: "100px",
            opacity: "1",
          },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        "image-reveal": {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "image-reveal-vertical": {
          "0%": {
            transform: "scaleY(0.5)",
            opacity: "0",
          },
          "100%": {
            transform: "scaleY(1)",
            opacity: "1",
          },
        },
        "title-rotate": {
          "0%": {
            transform: "rotate(0deg)",
          },
          "100%": {
            transform: "rotate(360deg)",
          },
        },
        "title-rotate-reverse": {
          "0%": {
            transform: "rotate(360deg)",
          },
          "100%": {
            transform: "rotate(0deg)",
          },
        },
        "title-rotate-vertical": {
          "0%": {
            transform: "rotateX(0deg)",
          },
          "100%": {
            transform: "rotateX(360deg)",
          },
        },
        "title-rotate-vertical-reverse": {
          "0%": {
            transform: "rotateX(360deg)",
          },
          "100%": {
            transform: "rotateX(0deg)",
          },
        },
        "title-rotate-vertical-reverse-slow":
          "title-rotate-vertical-reverse 2s linear infinite",
        "title-rotate-vertical-slow":
          "title-rotate-vertical 2s linear infinite",
        "title-rotate-reverse-slow": "title-rotate-reverse 2s linear infinite",
        "title-rotate-slow": "title-rotate 2s linear infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "fade-right": "fade-right 0.5s ease-out",
        "fade-left": "fade-left 0.5s ease-out",
        "fade-up-200": "fade-up 0.5s ease-out 200ms",
        "fade-up-400": "fade-up 0.5s ease-out 400ms",
        "fade-up-600": "fade-up 0.5s ease-out 600ms",
        "fade-up-800": "fade-up 0.5s ease-out 800ms",
        "fade-up-1000": "fade-up 0.5s ease-out 1000ms",
        "fade-down-200": "fade-down 0.5s ease-out 200ms",
        "fade-down-400": "fade-down 0.5s ease-out 400ms",
        "fade-down-600": "fade-down 0.5s ease-out 600ms",
        "fade-down-800": "fade-down 0.5s ease-out 800ms",
        "fade-down-1000": "fade-down 0.5s ease-out 1000ms",
        "fade-right-200": "fade-right 0.5s ease-out 200ms",
        "fade-right-400": "fade-right 0.5s ease-out 400ms",
        "fade-right-600": "fade-right 0.5s ease-out 600ms",
        "fade-right-800": "fade-right 0.5s ease-out 800ms",
        "fade-right-1000": "fade-right 0.5s ease-out 1000ms",
        "fade-left-200": "fade-left 0.5s ease-out 200ms",
        "fade-left-400": "fade-left 0.5s ease-out 400ms",
        "fade-left-600": "fade-left 0.5s ease-out 600ms",
        "fade-left-800": "fade-left 0.5s ease-out 800ms",
        "fade-left-1000": "fade-left 0.5s ease-out 1000ms",
        "first": "moveVertical 30s linear infinite",
        "second": "moveInCircle 20s reverse infinite",
        "third": "moveInCircle 40s linear infinite",
        "fourth": "moveHorizontal 40s ease infinite",
        "fifth": "moveInCircle 20s ease infinite",
        "scroll":
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        meteor: "meteor 5s linear infinite",
        "text-gradient": "text-gradient 1.5s linear infinite",
        "border-width": "border-width 3s infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        "image-reveal": "image-reveal .5s cubic-bezier(0.4, 0, 0.2, 1)",
        "image-reveal-vertical":
          "image-reveal-vertical .5s cubic-bezier(0.4, 0, 0.2, 1)",
        "title-rotate": "title-rotate 1.5s linear infinite",
        "title-rotate-reverse": "title-rotate-reverse 1.5s linear infinite",
        "title-rotate-vertical": "title-rotate-vertical 1.5s linear infinite",
        "title-rotate-vertical-reverse":
          "title-rotate-vertical-reverse 1.5s linear infinite",
        "title-rotate-vertical-reverse-slow":
          "title-rotate-vertical-reverse 2s linear infinite",
        "title-rotate-vertical-slow":
          "title-rotate-vertical 2s linear infinite",
        "title-rotate-reverse-slow": "title-rotate-reverse 2s linear infinite",
        "title-rotate-slow": "title-rotate 2s linear infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "fade-right": "fade-right 0.5s ease-out",
        "fade-left": "fade-left 0.5s ease-out",
        "fade-up-200": "fade-up 0.5s ease-out 200ms",
        "fade-up-400": "fade-up 0.5s ease-out 400ms",
        "fade-up-600": "fade-up 0.5s ease-out 600ms",
        "fade-up-800": "fade-up 0.5s ease-out 800ms",
        "fade-up-1000": "fade-up 0.5s ease-out 1000ms",
        "fade-down-200": "fade-down 0.5s ease-out 200ms",
        "fade-down-400": "fade-down 0.5s ease-out 400ms",
        "fade-down-600": "fade-down 0.5s ease-out 600ms",
        "fade-down-800": "fade-down 0.5s ease-out 800ms",
        "fade-down-1000": "fade-down 0.5s ease-out 1000ms",
        "fade-right-200": "fade-right 0.5s ease-out 200ms",
        "fade-right-400": "fade-right 0.5s ease-out 400ms",
        "fade-right-600": "fade-right 0.5s ease-out 600ms",
        "fade-right-800": "fade-right 0.5s ease-out 800ms",
        "fade-right-1000": "fade-right 0.5s ease-out 1000ms",
        "fade-left-200": "fade-left 0.5s ease-out 200ms",
        "fade-left-400": "fade-left 0.5s ease-out 400ms",
        "fade-left-600": "fade-left 0.5s ease-out 600ms",
        "fade-left-800": "fade-left 0.5s ease-out 800ms",
        "fade-left-1000": "fade-left 0.5s ease-out 1000ms",
        "first": "moveVertical 30s linear infinite",
        "second": "moveInCircle 20s reverse infinite",
        "third": "moveInCircle 40s linear infinite",
        "fourth": "moveHorizontal 40s ease infinite",
        "fifth": "moveInCircle 20s ease infinite",
        "scroll":
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100" height="100" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`,
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`,
          }),
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    },
  ],
} satisfies Config;

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

export default config;

