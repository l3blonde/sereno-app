'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function PWAInstaller() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [showInstallButton, setShowInstallButton] = useState(false);

    useEffect(() => {
        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Listen for the beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setInstallPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setShowInstallButton(false);
            console.log('PWA was installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        // Show the install prompt
        installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await installPrompt.userChoice;

        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the saved prompt since it can't be used again
        setInstallPrompt(null);
        setShowInstallButton(false);
    };

    // Function to clear all caches and unregister service workers
    const clearCacheAndReload = async () => {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
            console.log('All caches cleared');
        }

        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
            console.log('Service workers unregistered');
        }

        window.location.reload();
    };

    if (!showInstallButton) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                onClick={handleInstallClick}
                className="bg-primary text-white px-4 py-2 rounded-lg shadow-lg"
            >
                Install Sereno App
            </Button>

            {process.env.NODE_ENV === 'development' && (
                <Button
                    onClick={clearCacheAndReload}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg"
                >
                    Clear Cache & Reload
                </Button>
            )}
        </div>
    );
}