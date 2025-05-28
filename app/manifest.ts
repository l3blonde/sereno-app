import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Sereno - Mindfulness for Drivers",
        short_name: "Sereno",
        description: "A mindfulness and breathing app optimized for in-car use",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        icons: [
            {
                src: "/icons/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icons/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/icons/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        orientation: "any",
        categories: ["health", "lifestyle", "wellness"],
        screenshots: [
            {
                src: "/screenshots/desktop.png",
                sizes: "1280x800",
                type: "image/png",
                platform: "windows" // Changed from "wide" to a valid platform
            },
            {
                src: "/screenshots/mobile.png",
                sizes: "750x1334",
                type: "image/png",
                platform: "ios" // Changed from "narrow" to a valid platform
            },
        ],
        shortcuts: [
            {
                name: "Quick Calm",
                url: "/?exercise=quick-calm",
                description: "Start a quick calming session",
            },
            {
                name: "Deep Focus",
                url: "/?exercise=deep-focus",
                description: "Start a deep focus session",
            },
        ],
        id: "sereno-mindfulness-app",
        dir: "ltr",
        lang: "en-US",
        prefer_related_applications: false,
    }
}
