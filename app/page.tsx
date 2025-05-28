/**
 * @fileoverview Sereno Wellness App - Main Application Page
 * @description CarPlay-optimised wellness application with mobile landscape-first responsive design
 *
 * @functionality
 * - Breathing exercises: Quick Calm, Deep Focus, Morning Energise, Souffle de Vador
 * - Meditation sessions: Forest Escape, Ocean Mindfulness, Sereno Zen, Charging Chakras
 * - Audio management: Background audio, voice guidance, volume controls
 * - Session management: Timer controls, pause/resume, restart functionality
 * - Theme management: Dark mode default with customisable colour schemes
 * - Settings panel: Duration selection, theme customisation
 *
 * @styling
 * - Tailwind CSS (90%): Layout, spacing, colours, typography, responsive design, transitions
 * - Custom CSS (10%): Complex animations, breathing visuals, custom shapes only
 *
 * @layout
 * - Mobile landscape-first: Optimised for phones in landscape orientation (667x375px)
 * - Minimal gaps: Header 48px, content starts immediately below
 * - Split-view interface: Exercise list + preview (responsive stacking)
 * - Full-screen exercise views: Immersive breathing/meditation experiences
 * - Fixed positioning: Audio controls, back buttons (responsive sizing)
 *
 * @responsiveDesign
 * - Mobile landscape (default): Single column, minimal gaps, touch-optimised
 * - Tablet landscape (md:): Split-view layout, larger controls, more spacing
 * - Desktop/CarPlay (lg:): Full layout with sidebars, generous spacing
 * - All responsive logic handled in this file with Tailwind classes
 *
 * @cssFiles
 * - app/globals.css: Base styles, typography system only
 * - app/styles/components.css: Complex animations only (breathing, custom shapes)
 * - Removed: responsive.css, layout.css (now handled with Tailwind)
 */

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ThemeProvider, useTheme } from "@/components/theme-provider"
import type { MeditationSession } from "@/lib/meditation/meditation-data"
import { ThemeColorProvider } from "@/components/theme-color-provider"
import { AudioProvider, useAudioContext } from "@/components/audio-service"
import { HeaderMenu } from "@/components/ui/header-menu"
import { SplitView } from "@/components/ui/split-view"
import { AudioFooter } from "@/components/ui/audio-footer"
import { BackButton } from "@/components/ui/back-button"
import { SettingsPanel } from "@/components/ui/settings-panel"
import { WindIcon } from "@/components/icons/wind-icon"
import { LotusIcon } from "@/components/icons/lotus-icon"
import { TimerOverlay } from "@/components/ui/timer-overlay"
import { BreathingTimer } from "@/components/ui/breathing-timer"

import QuickCalm from "@/components/features/breathing/quick-calm"
import DeepFocus from "@/components/features/breathing/deep-focus"
import MorningEnergize from "@/components/features/breathing/morning-energize"
import SouffleDeVador from "@/components/features/breathing/souffle-de-vador"
import MeditationSessionView from "@/components/features/meditation/meditation-session"

const exerciseCategories = {
    breathing: [
        {
            id: "quick-calm",
            title: "Quick Calm",
            description:
                "Reduce stress quickly with guided breathing techniques designed for moments when you need immediate relaxation.",
            category: "breathing",
            tags: ["relax"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/forest-background.mp3",
        },
        {
            id: "deep-focus",
            title: "Deep Focus",
            description:
                "Enhance concentration and mental clarity with this breathing pattern optimized for sustained attention.",
            category: "breathing",
            tags: ["focus"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/deep-focus.mp3",
        },
        {
            id: "morning-energize",
            title: "Morning Energize",
            description:
                "Start your day with this energizing breathing exercise designed to increase alertness and vitality.",
            category: "breathing",
            tags: ["vitalize"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/morning-energize.mp3",
        },
        {
            id: "souffle-de-vador",
            title: "Souffle de Vador",
            description:
                "Experience deep immersive breathing with this unique pattern inspired by focused breathing techniques.",
            category: "breathing",
            tags: ["focus"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/imperialMarch.mp3",
        },
    ],
    meditation: [
        {
            id: "forest-escape",
            title: "Forest Escape",
            description:
                "Find peace in a virtual forest environment with guided meditation to help you disconnect and relax.",
            category: "meditation",
            tags: ["relax"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/forest-background.mp3",
            videoSrc: "/videos/forest-background.mp4",
            thumbnailSrc: "/thumbnails/forest-escape.png",
        },
        {
            id: "ocean-mindfulness",
            title: "Ocean Mindfulness",
            description:
                "Let the rhythm of ocean waves guide you to a state of calm and mindfulness with this meditation session.",
            category: "meditation",
            tags: ["relax"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/ocean-background.mp3",
            videoSrc: "/videos/ocean-background.mp4",
            thumbnailSrc: "/thumbnails/ocean-mindfulness.png",
        },
        {
            id: "sereno-zen",
            title: "Sereno Zen",
            description:
                "Focus at high speeds with this meditation designed specifically for drivers seeking mental clarity.",
            category: "meditation",
            tags: ["focus"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/sereno-mountain-drive.mp3",
            videoSrc: "/videos/porsche-mountain-drive.mp4",
            thumbnailSrc: "/thumbnails/sereno-zen.png",
        },
        {
            id: "charging-chakras",
            title: "Charging Chakras",
            description:
                "Energize while charging your vehicle with this meditation focused on revitalizing your energy centers.",
            category: "meditation",
            tags: ["vitalize"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/charging-chakras.mp3",
            videoSrc: "/videos/charging-chakras.mp4",
            thumbnailSrc: "/thumbnails/charging-chakras.png",
        },
    ],
}

type AppTheme = "dark" | "light" | "focus" | "relax"

function AppContent() {
    const { isInitialized, playAudio, setVolume, playBackgroundAudio, stopBackgroundAudio, stopAndPlayAudio } =
        useAudioContext()

    const [activeTab, setActiveTab] = useState<"breathing" | "meditating">("breathing")
    const [sessionDuration, setSessionDuration] = useState(300) // 5 minutes default
    const [appTheme, setAppTheme] = useState<AppTheme>("dark")
    const [selectedExercise, setSelectedExercise] = useState(exerciseCategories.breathing[0])
    const [showSettings, setShowSettings] = useState(false)
    const [showTimerOverlay, setShowTimerOverlay] = useState(false)

    const [currentView, setCurrentView] = useState("home") // "home", "breathing", "meditation", "settings"
    const [currentExercise, setCurrentExercise] = useState("")
    const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null)

    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
    const [volume, setVolumeState] = useState(80)
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(300)

    const { setTheme } = useTheme()
    const isLightTheme = appTheme === "light"

    const currentPhaseRef = useRef<"inhale" | "hold" | "exhale">("inhale")

    useEffect(() => {
        if (!selectedExercise && exerciseCategories.breathing.length > 0) {
            console.log("Setting default exercise")
            setSelectedExercise(exerciseCategories.breathing[0])
        }
    }, [selectedExercise])

    useEffect(() => {
        console.log("Current exercise state:", {
            selectedExercise: selectedExercise?.id,
            currentView,
            currentExercise,
            activeTab,
        })
    }, [selectedExercise, currentView, currentExercise, activeTab])

    const handleSelectTheme = (theme: string) => {
        setAppTheme(theme as AppTheme)
        document.documentElement.setAttribute("data-theme", theme)

        const themeProviderMap: Record<AppTheme, "focus" | "vitalize" | "zen"> = {
            dark: "focus",
            light: "vitalize",
            focus: "focus",
            relax: "zen",
        }
        setTheme(themeProviderMap[theme as AppTheme])
        localStorage.setItem("appTheme", theme)
    }

    const handleTimerSelect = (minutes: number) => {
        setSessionDuration(minutes * 60)
        setTimeRemaining(minutes * 60)
        setShowTimerOverlay(false) // Close overlay after selection
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem("appTheme") as AppTheme | null
        if (savedTheme) {
            setAppTheme(savedTheme)
            document.documentElement.setAttribute("data-theme", savedTheme)

            const themeProviderMap: Record<AppTheme, "focus" | "vitalize" | "zen"> = {
                dark: "focus",
                light: "vitalize",
                focus: "focus",
                relax: "zen",
            }

            if (themeProviderMap[savedTheme]) {
                setTheme(themeProviderMap[savedTheme])
            } else {
                setTheme("focus")
                document.documentElement.setAttribute("data-theme", "dark")
            }
        } else {
            setTheme("focus")
            document.documentElement.setAttribute("data-theme", "dark")
        }
    }, [setTheme])

    const handlePhaseChange = useCallback(
        (phase: "inhale" | "hold" | "exhale") => {
            currentPhaseRef.current = phase

            setTimeout(() => {
                setCurrentPhase(phase)

                if (voiceEnabled && audioEnabled && isInitialized) {
                    const audioFile =
                        phase === "inhale" ? "/audio/inhale.mp3" : phase === "hold" ? "/audio/hold.mp3" : "/audio/exhale.mp3"

                    stopAndPlayAudio(audioFile, false, 1.0).catch(() => {
                        console.warn(`Could not play ${phase} audio, continuing without guidance`)
                    })
                }
            }, 0)
        },
        [voiceEnabled, audioEnabled, isInitialized, stopAndPlayAudio],
    )

    const getExerciseBackgroundAudio = (exerciseId: string): string => {
        const exercise = exerciseCategories.breathing.find((ex) => ex.id === exerciseId)
        return exercise?.audioSrc || "/audio/forest-background.mp3"
    }

    const startBreathingExercise = (exercise: any) => {
        console.log(`Starting breathing exercise: ${exercise.id}`)
        setCurrentExercise(exercise.id)
        setCurrentView("breathing")
        setIsActive(true)
        setIsPaused(false)
        setCurrentPhase("inhale")
        setTimeRemaining(sessionDuration)

        if (audioEnabled && isInitialized && exercise.audioSrc) {
            playBackgroundAudio(exercise.audioSrc, true, 0.5).catch(() => {
                console.warn(`Could not play background audio for ${exercise.id}, continuing without audio`)
            })
        }
    }

    const startMeditationSession = (exercise: any) => {
        console.log(`Starting meditation session: ${exercise.id}`)
        setCurrentSession(exercise as MeditationSession)
        setCurrentView("meditation")
        setTimeRemaining(sessionDuration)
        setIsActive(true)
        setIsPaused(false)

        if (audioEnabled && isInitialized && exercise.audioSrc) {
            playBackgroundAudio(exercise.audioSrc, true, 0.5).catch(() => {
                console.warn("Could not play meditation audio, continuing without audio")
            })
        }
    }

    const returnToHome = () => {
        setCurrentView("home")
        setCurrentExercise("")
        setCurrentSession(null)
        setIsActive(false)
        stopBackgroundAudio()
    }

    const handlePlayPause = () => {
        setIsPaused(!isPaused)

        if (isPaused) {
            if (audioEnabled && isInitialized) {
                if (currentView === "breathing") {
                    const backgroundAudio = getExerciseBackgroundAudio(currentExercise)
                    if (backgroundAudio) {
                        playBackgroundAudio(backgroundAudio, true, 0.5).catch(() => {
                            console.warn(`Could not resume background audio, continuing without audio`)
                        })
                    }
                } else if (currentView === "meditation" && currentSession) {
                    playBackgroundAudio(currentSession.audioSrc, true, 0.5).catch(() => {
                        console.warn("Could not resume meditation audio, continuing without audio")
                    })
                }
            }
        } else {
            stopBackgroundAudio()
        }
    }

    const handleRestart = () => {
        setCurrentPhase("inhale")
        setIsPaused(false)
        setTimeRemaining(sessionDuration)

        stopBackgroundAudio()
        if (audioEnabled && isInitialized) {
            if (currentView === "breathing") {
                const backgroundAudio = getExerciseBackgroundAudio(currentExercise)
                if (backgroundAudio) {
                    playBackgroundAudio(backgroundAudio, true, 0.5).catch(() => {
                        console.warn(`Could not restart background audio, continuing without audio`)
                    })
                }
            } else if (currentView === "meditation" && currentSession) {
                playBackgroundAudio(currentSession.audioSrc, true, 0.5).catch(() => {
                    console.warn("Could not resume meditation audio, continuing without audio")
                })
            }
        }
    }

    const handleVolumeChange = (newVolume: number) => {
        setVolumeState(newVolume)
        setVolume(newVolume / 100)
    }

    const handleAudioToggle = () => {
        setAudioEnabled(!audioEnabled)
        if (audioEnabled) {
            stopBackgroundAudio()
        } else if (isInitialized) {
            if (currentView === "breathing") {
                const backgroundAudio = getExerciseBackgroundAudio(currentExercise)
                if (backgroundAudio) {
                    playBackgroundAudio(backgroundAudio, true, 0.5).catch(() => {
                        console.warn(`Could not play background audio, continuing without audio`)
                    })
                }
            } else if (currentView === "meditation" && currentSession) {
                playBackgroundAudio(currentSession.audioSrc, true, 0.5).catch(() => {
                    console.warn("Could not play meditation audio, continuing without audio")
                })
            }
        }
    }

    useEffect(() => {
        if (isActive && !isPaused) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsPaused(true)
                        clearInterval(timer)

                        if (voiceEnabled && audioEnabled && isInitialized) {
                            playAudio("/audio/complete.mp3", false, 1.0).catch(() => {
                                console.warn("Could not play completion audio")
                            })
                        }

                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(timer)
        }
    }, [isActive, isPaused, voiceEnabled, audioEnabled, isInitialized, playAudio])

    const handleSelectExercise = (exercise: any) => {
        console.log(`Selected exercise: ${exercise.id}`)
        setSelectedExercise(exercise)
    }

    const handleStartExercise = (exercise: any) => {
        try {
            console.log(`Handle start exercise called with: ${exercise?.id}`)
            if (!exercise) {
                console.error("Exercise is null or undefined")
                return
            }

            if (exercise.category === "breathing") {
                startBreathingExercise(exercise)
            } else {
                startMeditationSession(exercise)
            }
        } catch (error) {
            console.error("Error starting exercise:", error)
        }
    }

    const renderBreathingPreviewAction = (exercise: any) => {
        if (!exercise) return null

        switch (exercise.id) {
            case "quick-calm":
                return <QuickCalm isActive={false} isPaused={true} currentPhase="inhale" isLightTheme={isLightTheme} />
            case "deep-focus":
                return <DeepFocus isPaused={true} />
            case "morning-energize":
                return <MorningEnergize isActive={false} isPaused={true} currentPhase="inhale" isLightTheme={isLightTheme} />
            case "souffle-de-vador":
                return <SouffleDeVador isActive={false} isPaused={true} currentPhase="inhale" isLightTheme={isLightTheme} />
            default:
                return null
        }
    }

    // Mobile landscape-first header - Minimal height, no gaps
    const renderHeaderMenu = () => (
        <header
            className="
    fixed top-0 left-20 right-16 lg:left-24 lg:right-18
    h-12 md:h-16 lg:h-20
    bg-black/95 backdrop-blur-sm
    border-b border-white/10
    z-40
    flex items-center
  "
        >
            <HeaderMenu
                activeTab={activeTab}
                onTabChange={(tab) => {
                    setActiveTab(tab)
                    if (tab === "breathing" && exerciseCategories.breathing.length > 0) {
                        setSelectedExercise(exerciseCategories.breathing[0])
                    } else if (tab === "meditating" && exerciseCategories.meditation.length > 0) {
                        setSelectedExercise(exerciseCategories.meditation[0])
                    }
                }}
                onSettingsClick={() => {
                    console.log("Settings clicked")
                    setShowSettings(!showSettings)
                }}
            />
        </header>
    )

    // Mobile landscape-first audio footer - Compact design
    const renderAudioFooter = () => (
        <div
            className="
      fixed bottom-1 left-1 right-1
      md:bottom-3 md:left-4 md:right-4
      lg:bottom-4 lg:left-16 lg:right-16
      z-50
    "
        >
            <div
                className="
        w-full
        px-2 py-1.5
        md:px-4 md:py-2.5
        lg:px-6 lg:py-3
        rounded-lg
        md:rounded-xl
        lg:rounded-2xl
        bg-black/80 backdrop-blur-md
        border border-white/20 shadow-lg
      "
            >
                <AudioFooter
                    isPlaying={!isPaused}
                    onPlayPauseAction={handlePlayPause}
                    onRestartAction={handleRestart}
                    timeRemaining={timeRemaining}
                    totalDuration={sessionDuration}
                    voiceEnabled={voiceEnabled}
                    onVoiceToggleAction={() => setVoiceEnabled(!voiceEnabled)}
                    audioEnabled={audioEnabled}
                    onAudioToggleAction={handleAudioToggle}
                />
            </div>
        </div>
    )

    const renderBreathingView = () => {
        const exerciseTitle =
            exerciseCategories.breathing.find((ex) => ex.id === currentExercise)?.title || "Breathing Exercise"

        return (
            <div className="fixed inset-0 bg-black overflow-hidden z-45">
                {/* Back button only - Mobile landscape optimised */}
                <div
                    className="
        fixed top-2 left-2
        md:top-4 md:left-4
        lg:top-6 lg:left-6
        z-50
      "
                >
                    <BackButton onBack={returnToHome} exerciseTitle={exerciseTitle} />
                </div>

                <div className="absolute inset-0 z-5">
                    {currentExercise === "quick-calm" && (
                        <QuickCalm
                            isActive={isActive}
                            isPaused={isPaused}
                            currentPhase={currentPhase}
                            isLightTheme={isLightTheme}
                        />
                    )}
                    {currentExercise === "deep-focus" && (
                        <DeepFocus
                            inhaleDuration={4}
                            holdDuration={4}
                            exhaleDuration={4}
                            isPaused={isPaused}
                            currentPhase={currentPhase}
                        />
                    )}
                    {currentExercise === "morning-energize" && (
                        <MorningEnergize
                            isActive={isActive}
                            isPaused={isPaused}
                            currentPhase={currentPhase}
                            isLightTheme={isLightTheme}
                        />
                    )}
                    {currentExercise === "souffle-de-vador" && (
                        <SouffleDeVador
                            isActive={isActive}
                            isPaused={isPaused}
                            currentPhase={currentPhase}
                            isLightTheme={isLightTheme}
                        />
                    )}
                </div>

                {/* Breathing timer - Mobile landscape optimised */}
                <div
                    className="
        fixed inset-0 flex items-center justify-center z-20
        pointer-events-none
        p-2 md:p-6 lg:p-8
      "
                >
                    <BreathingTimer
                        duration={sessionDuration}
                        timeRemaining={timeRemaining}
                        isPlaying={!isPaused}
                        currentPhase={currentPhase}
                        onPhaseChange={handlePhaseChange}
                        size="large"
                        isLightTheme={isLightTheme}
                    />
                </div>

                {renderAudioFooter()}
            </div>
        )
    }

    const renderMeditationView = () => {
        if (!currentSession) return <div>Session not found</div>

        return (
            <div className="fixed inset-0 bg-black overflow-hidden z-45">
                {/* Back button - Mobile landscape optimised */}
                <div
                    className="
          fixed top-2 left-2
          md:top-4 md:left-4
          lg:top-6 lg:left-6
          z-50
        "
                >
                    <BackButton onBack={returnToHome} exerciseTitle={currentSession.title} />
                </div>

                <div className="absolute inset-0">
                    <MeditationSessionView
                        session={currentSession}
                        onExitAction={returnToHome}
                        isLightTheme={isLightTheme}
                        volume={volume}
                        isPlaying={!isPaused}
                        onPlayPauseAction={handlePlayPause}
                        onRestartAction={handleRestart}
                        onVolumeChangeAction={handleVolumeChange}
                        voiceEnabled={voiceEnabled}
                        onVoiceToggleAction={() => setVoiceEnabled(!voiceEnabled)}
                        audioEnabled={audioEnabled}
                        onAudioToggleAction={handleAudioToggle}
                        timeRemaining={timeRemaining}
                        totalDuration={sessionDuration}
                    />
                </div>

                {renderAudioFooter()}
            </div>
        )
    }

    const renderView = () => {
        if (showSettings) {
            return (
                <div className="min-h-screen bg-black">
                    {renderHeaderMenu()}
                    <div className="w-full pt-12 md:pt-16 lg:pt-20 px-2 md:px-6 lg:px-16">
                        <SettingsPanel
                            onCloseAction={() => setShowSettings(false)}
                            onSelectDurationAction={handleTimerSelect}
                            currentDuration={sessionDuration}
                            onSelectThemeAction={handleSelectTheme}
                            currentTheme={appTheme}
                        />
                    </div>
                </div>
            )
        }

        switch (currentView) {
            case "home":
                return (
                    <div className="min-h-screen bg-black">
                        {renderHeaderMenu()}
                        <main className="w-full h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] pt-12 md:pt-16 lg:pt-20 overflow-hidden">
                            <SplitView
                                exercises={activeTab === "breathing" ? exerciseCategories.breathing : exerciseCategories.meditation}
                                selectedExercise={selectedExercise}
                                onSelectExerciseAction={handleSelectExercise}
                                onStartExerciseAction={handleStartExercise}
                                renderBreathingPreviewAction={renderBreathingPreviewAction}
                            />
                        </main>
                    </div>
                )
            case "breathing":
                return renderBreathingView()
            case "meditation":
                return renderMeditationView()
            default:
                return null
        }
    }

    // Add the TimerOverlay rendering separately
    const renderTimerOverlay = () => {
        if (showTimerOverlay) {
            return (
                <TimerOverlay
                    onCloseAction={() => setShowTimerOverlay(false)}
                    onSelectDurationAction={handleTimerSelect}
                    currentDuration={Math.floor(sessionDuration / 60)}
                />
            )
        }
        return null
    }

    return (
        <div className="w-full bg-black text-white overflow-hidden">
            {renderView()}
            {renderTimerOverlay()}
        </div>
    )
}

const Home = () => {
    return (
        <ThemeProvider defaultTheme="focus" enableSystem={false}>
            <ThemeColorProvider>
                <AudioProvider>
                    <AppContent />
                </AudioProvider>
            </ThemeColorProvider>
        </ThemeProvider>
    )
}

export default Home
