/**
 * Tailwind CSS Configuration - Sereno Design System
 * @description 80/20 Rule Implementation: 80% Tailwind utilities, 20% custom CSS
 * @migrated Layout, spacing, colours, typography, responsive design, simple transitions to Tailwind
 * @retained Complex animations, custom shapes, scrollbar styling in CSS files
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                // Porsche Design System + CarPlay optimised fonts
                sans: ["Barlow Condensed", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
                system: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
            },
            fontSize: {
                // Porsche Design System Fluid Typography Scale
                // Display styles (hero, stats, emotional moments)
                "display-large": ["clamp(3.5rem, 8vw, 6rem)", { lineHeight: "1.1", fontWeight: "700" }],
                "display-medium": ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.1", fontWeight: "700" }],
                "display-small": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2", fontWeight: "600" }],

                // Headline styles (section appointing)
                "headline-xx-large": ["clamp(2rem, 4vw, 2.5rem)", { lineHeight: "1.2", fontWeight: "600" }],
                "headline-x-large": ["clamp(1.75rem, 3.5vw, 2.25rem)", { lineHeight: "1.2", fontWeight: "600" }],
                "headline-large": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", fontWeight: "600" }],
                "headline-medium": ["clamp(1.25rem, 2.5vw, 1.75rem)", { lineHeight: "1.3", fontWeight: "600" }],
                "headline-small": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.4", fontWeight: "600" }],

                // Text styles (running text)
                "text-large": ["clamp(1.125rem, 2vw, 1.25rem)", { lineHeight: "1.5", fontWeight: "500" }],
                "text-medium": ["clamp(1rem, 1.5vw, 1.125rem)", { lineHeight: "1.5", fontWeight: "500" }],
                "text-small": ["clamp(0.875rem, 1.25vw, 1rem)", { lineHeight: "1.5", fontWeight: "500" }], // Default
                "text-x-small": ["clamp(0.75rem, 1vw, 0.875rem)", { lineHeight: "1.4", fontWeight: "500" }],
                "text-xx-small": ["clamp(0.625rem, 0.75vw, 0.75rem)", { lineHeight: "1.4", fontWeight: "500" }], // Disclaimers only

                // CarPlay specific sizes (minimum readable whilst driving)
                "carplay-primary": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.2", fontWeight: "600" }],
                "carplay-secondary": ["clamp(1.125rem, 2vw, 1.5rem)", { lineHeight: "1.3", fontWeight: "500" }],
                "carplay-tertiary": ["clamp(1rem, 1.5vw, 1.25rem)", { lineHeight: "1.4", fontWeight: "500" }],
            },
            colors: {
                "sereno-red": "#cf0000",
                "sereno-red-dark": "#800000",
                "sereno-red-light": "#ff0000",
                "sereno-red-hover": "#a00000",
                "sereno-red-active": "#600000",
                "porsche-red": "#e41300",
                "sereno-focus": "#3b82f6",
                "sereno-vitalize": "#10b981",
                "sereno-zen": "#8b5cf6",
                "sereno-bg-dark": "#000000",
                "sereno-bg-light": "#ffffff",
                // Porsche Design System colours
                "pds-primary": "#010205",
                "pds-background-base": "#FFFFFF",
                "pds-background-surface": "#EEEFF2",
                "pds-contrast-low": "#D8D8DB",
                "pds-contrast-medium": "#6B6D70",
                "pds-contrast-high": "#535457",
                // Surface colours
                "sereno-surface-dark": "rgba(53, 54, 57, 0.8)",
                "sereno-surface-medium": "rgba(107, 109, 112, 0.8)",
                "sereno-surface-light": "rgba(216, 216, 219, 0.8)",
                "sereno-text-primary": "#ffffff",
                "sereno-text-secondary": "rgba(255, 255, 255, 0.7)",
                "sereno-text-tertiary": "rgba(255, 255, 255, 0.5)",
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
                "sereno-gray": {
                    50: "rgba(83,84,87,0.1)",
                    100: "rgba(83,84,87,0.2)",
                    200: "rgba(83,84,87,0.3)",
                    300: "rgba(83,84,87,0.4)",
                    400: "rgba(83,84,87,0.5)",
                    500: "rgba(83,84,87,0.6)",
                    600: "rgba(83,84,87,0.7)",
                    700: "rgba(83,84,87,0.8)",
                    800: "rgba(83,84,87,0.9)",
                    900: "rgba(83,84,87,1)",
                },
                "sereno-surface": {
                    dark: "rgba(53,54,57,0.8)",
                    medium: "rgba(107,109,112,0.8)",
                    light: "rgba(216,216,219,0.8)",
                },
            },
            animation: {
                breathe: "breathe 8s infinite ease-in-out",
                "subtle-pulse": "subtle-pulse 3s infinite alternate",
                shimmer: "shimmer 2s infinite",
                "fade-in-out": "fadeInOut 3s ease-in-out",
            },
            keyframes: {
                breathe: {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(1.2)" },
                    "100%": { transform: "scale(1)" },
                },
                "subtle-pulse": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "0.6" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                fadeInOut: {
                    "0%": { opacity: "0", transform: "translate(-50%, -1.25rem)" },
                    "15%": { opacity: "1", transform: "translate(-50%, 0)" },
                    "85%": { opacity: "1", transform: "translate(-50%, 0)" },
                    "100%": { opacity: "0", transform: "translate(-50%, -1.25rem)" },
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            zIndex: {
                45: "45",
                50: "50",
                100: "100",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
}
