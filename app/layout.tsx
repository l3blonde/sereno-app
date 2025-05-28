/**
 * Root layout - CarPlay app shell with sidebars and main content area
 * @description Provides system dock (left), status bar (right), and main content wrapper
 */
import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, Barlow_Condensed } from "next/font/google"
import { AudioProvider } from "@/components/audio-service"
import { AudioInitializer } from "@/components/audio-initializer"
import { DrivingModeProvider } from "@/components/driving-mode-provider"
import { OrientationProvider } from "@/contexts/orientation-context"
import { ThemeProvider } from "@/contexts/theme-context"
import { SystemDock } from "@/components/ui/system-dock"
import { StatusBar } from "@/components/ui/status-bar"
import { OrientationWarning } from "@/components/ui/orientation-warning"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const barlowCondensed = Barlow_Condensed({
    subsets: ["latin"],
    variable: "--font-barlow-condensed",
    weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
    title: "Sereno - CarPlay Wellness",
    description: "CarPlay-optimized wellness and navigation app",
    generator: "v0.dev",
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
        <body className="carplay-layout">
        <ThemeProvider>
            <OrientationProvider>
                <DrivingModeProvider>
                    <AudioProvider>
                        <AudioInitializer />

                        {/* Mobile Orientation Warning */}
                        <OrientationWarning />

                        {/* Left Sidebar - Driver Controls (All screen sizes) */}
                        <SystemDock />

                        {/* Main Content Area */}
                        <main className="carplay-main-content">{children}</main>

                        {/* Right Sidebar - System Info (All screen sizes) */}
                        <StatusBar />
                    </AudioProvider>
                </DrivingModeProvider>
            </OrientationProvider>
        </ThemeProvider>
        </body>
        </html>
    )
}
