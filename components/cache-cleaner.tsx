"use client"

import { useEffect } from "react"

export function CacheCleaner() {
    useEffect(() => {
        // Unregister service workers on component mount
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (const registration of registrations) {
                    registration.unregister()
                    console.log("Service worker unregistered for development")
                }
            })
        }

        // Clear caches
        if ("caches" in window) {
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        return caches.delete(cacheName).then(() => {
                            console.log(`Cache ${cacheName} deleted`)
                        })
                    }),
                )
            })
        }
    }, [])

    return null // This component doesn't render anything
}
