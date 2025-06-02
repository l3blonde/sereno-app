"use client"

import { useState, useEffect } from "react"
import { X, Download } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstaller() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showInstallPrompt, setShowInstallPrompt] = useState(false)

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault()
            // Save the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Show our custom install prompt
            setShowInstallPrompt(true)
        }

        const handleAppInstalled = () => {
            // Hide the install prompt
            setShowInstallPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
        window.addEventListener("appinstalled", handleAppInstalled)

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
            window.removeEventListener("appinstalled", handleAppInstalled)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        await deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === "accepted") {
            console.log("User accepted the install prompt")
        } else {
            console.log("User dismissed the install prompt")
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null)
        setShowInstallPrompt(false)
    }

    const handleDismiss = () => {
        setShowInstallPrompt(false)
        // Don't clear deferredPrompt in case user wants to install later
    }

    if (!showInstallPrompt) {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:right-4 md:w-80">
            <div className="bg-black/90 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Download size={20} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-semibold text-sm">Install Sereno</h3>
                            <p className="text-gray-300 text-xs">Add to your home screen for quick access</p>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-white transition-colors"
                        aria-label="Dismiss install prompt"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 px-3 py-2 text-gray-300 text-sm border border-gray-600 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Not now
                    </button>
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Install
                    </button>
                </div>
            </div>
        </div>
    )
}
