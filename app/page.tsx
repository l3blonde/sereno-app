/**
 * Sereno Wellness App - CarPlay-optimised breathing and meditation exercises
 * Mobile landscape-first design with 4-4-4 breathing patterns and voice guidance
 */

"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import type React from "react"

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
import { SystemDock } from "@/components/ui/system-dock"

import QuickCalm from "@/components/features/breathing/quick-calm"
import DeepFocus from "@/components/features/breathing/deep-focus"
import MorningEnergize from "@/components/features/breathing/morning-energize"
import SouffleDeVador from "@/components/features/breathing/souffle-de-vador"
import MeditationSessionView from "@/components/features/meditation/meditation-session"
import { BreathingTimer } from "@/components/ui/breathing-timer"

const exerciseCategories = {
    breathing: [
        {
            id: "quick-calm",
            title: "Quick Calm",
            description: "Instant stress relief",
            category: "breathing" as const,
            tags: ["relax"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/forest-background.mp3",
        },
        {
            id: "deep-focus",
            title: "Deep Focus",
            description: "Enhanced concentration",
            category: "breathing" as const,
            tags: ["focus"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/deep-focus.mp3",
        },
        {
            id: "morning-energize",
            title: "Morning Energize",
            description: "Start day energized",
            category: "breathing" as const,
            tags: ["vitalize"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/morning-energize.mp3",
        },
        {
            id: "souffle-de-vador",
            title: "Souffle de Vador",
            description: "Deep immersive breathing",
            category: "breathing" as const,
            tags: ["focus"],
            icon: <WindIcon width={24} height={24} />,
            audioSrc: "/audio/imperialMarch.mp3",
        },
    ],
    meditation: [
        {
            id: "forest-escape",
            title: "Forest Escape",
            description: "Virtual forest peace",
            category: "meditation" as const,
            tags: ["relax", "nature"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/forest-background.mp3",
            videoSrc: "/videos/forest-background.mp4",
            thumbnailSrc: "/thumbnails/forest-escape.png",
            voiceGuidance: {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            },
        },
        {
            id: "ocean-mindfulness",
            title: "Ocean Mindfulness",
            description: "Wave rhythm meditation",
            category: "meditation" as const,
            tags: ["relax", "nature"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/ocean-background.mp3",
            videoSrc: "/videos/ocean-background.mp4",
            thumbnailSrc: "/thumbnails/ocean-mindfulness.png",
            voiceGuidance: {
                intro: "/audio/ocean-intro.mp3",
                middle: "/audio/ocean-middle.mp3",
                end: "/audio/ocean-end.mp3",
            },
        },
        {
            id: "sereno-zen",
            title: "Sereno Zen",
            description: "Driving focus clarity",
            category: "meditation" as const,
            tags: ["focus", "driving"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/sereno-mountain-drive.mp3",
            videoSrc: "/videos/porsche-mountain-drive.mp4",
            thumbnailSrc: "/thumbnails/sereno-zen.png",
            voiceGuidance: {
                intro: "/audio/zen-intro.mp3",
                middle: "/audio/zen-middle.mp3",
                end: "/audio/zen-end.mp3",
            },
        },
        {
            id: "charging-chakras",
            title: "Charging Chakras",
            description: "Energy center alignment",
            category: "meditation" as const,
            tags: ["vitalize", "energy"],
            icon: <LotusIcon width={24} height={24} />,
            audioSrc: "/audio/charging-chakras.mp3",
            videoSrc: "/videos/charging-chakras.mp4",
            thumbnailSrc: "/thumbnails/charging-chakras.png",
            voiceGuidance: {
                intro: "/audio/chakras-intro.mp3",
                middle: "/audio/chakras-middle.mp3",
                end: "/audio/chakras-end.mp3",
            },
        },
    ],
}

type AppTheme = "dark" | "light" | "focus" | "relax"

interface BaseExercise {
    id: string
    title: string
    description: string
    category: "breathing" | "meditation"
    tags: string[]
    icon: React.ReactNode
    audioSrc: string
}

interface BreathingExercise extends BaseExercise {
    category: "breathing"
}

interface MeditationExercise extends BaseExercise {
    category: "meditation"
    videoSrc: string
    thumbnailSrc: string
    voiceGuidance?: {
        intro: string
        middle: string
        end: string
    }
}

type ExerciseItem = BreathingExercise | MeditationExercise

function AppContent() {
    const { isInitialized, playBackgroundAudio, stopBackgroundAudio, stopAndPlayAudio, stopAudio } = useAudioContext()

    // State management
    const [activeTab, setActiveTab] = useState<"breathing" | "meditating">("breathing")
    const [sessionDuration, setSessionDuration] = useState(120) // 2 minutes default for breathing
    const [appTheme, setAppTheme] = useState<AppTheme>("dark")
    const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(exerciseCategories.breathing[0])
    const [showSettings, setShowSettings] = useState(false)
    const [showTimerOverlay, setShowTimerOverlay] = useState(false)

    const [currentView, setCurrentView] = useState("home")
    const [currentExercise, setCurrentExercise] = useState("")
    const [currentSession, setCurrentSession] = useState<MeditationSession | null>(null)

    const [isActive, setIsActive] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
    const [isFirstCycle, setIsFirstCycle] = useState(true)
    const volume = 80
    const [voiceEnabled, setVoiceEnabled] = useState(true)
    const [audioEnabled, setAudioEnabled] = useState(true)
    const [timeRemaining, setTimeRemaining] = useState(120)

    const { setTheme } = useTheme()
    const isLightTheme = appTheme === "light"

    const currentPhaseRef = useRef<"inhale" | "hold" | "exhale">("inhale")
    const isPlaying = !isPaused

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
        setShowTimerOverlay(false)
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem("appTheme") as AppTheme | null
        const theme = savedTheme || "dark"

        if (savedTheme) {
            setAppTheme(savedTheme)
            document.documentElement.setAttribute("data-theme", theme)

            const themeProviderMap: Record<AppTheme, "focus" | "vitalize" | "zen"> = {
                dark: "focus",
                light: "vitalize",
                focus: "focus",
                relax: "zen",
            }

            if (themeProviderMap[savedTheme]) {
                setTheme(themeProviderMap[theme as AppTheme])
            } else {
                setTheme("focus")
                document.documentElement.setAttribute("data-theme", "dark")
            }
        } else {
            setTheme("focus")
            document.documentElement.setAttribute("data-theme", "dark")
        }
    }, [setTheme])

    // Session timer effect - add this after the existing useEffects
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isActive && !isPaused && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 1) {
                        // Session completed
                        setIsActive(false)
                        setIsPaused(false)
                        stopBackgroundAudio()
                        stopAudio() // Stop voice guidance when session completes
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) {
                clearInterval(interval)
            }
        }
    }, [isActive, isPaused, timeRemaining, stopBackgroundAudio, stopAudio])

    const handlePhaseChange = useCallback(
        (phase: "inhale" | "hold" | "exhale") => {
            console.log(`Phase change triggered: ${currentPhaseRef.current} -> ${phase}`)
            currentPhaseRef.current = phase

            setTimeout(() => {
                setCurrentPhase(phase)

                if (voiceEnabled && audioEnabled && isInitialized) {
                    let audioFile: string

                    // Use detailed instructions for first cycle, then simple cues
                    if (isFirstCycle) {
                        switch (phase) {
                            case "inhale":
                                audioFile = "/audio/inhale-start.mp3"
                                break
                            case "hold":
                                audioFile = "/audio/hold-start.mp3"
                                break
                            case "exhale":
                                audioFile = "/audio/exhale-start.mp3"
                                setIsFirstCycle(false)
                                break
                        }
                    } else {
                        audioFile = `/audio/${phase}.mp3`
                    }

                    console.log(`Playing voice guidance: ${audioFile}`)
                    stopAndPlayAudio(audioFile, false, 0.8).catch(() => {
                        console.warn(`Could not play ${phase} audio, continuing without guidance`)
                    })
                }
            }, 0)
        },
        [voiceEnabled, audioEnabled, isInitialized, stopAndPlayAudio, isFirstCycle],
    )

    const getExerciseBackgroundAudio = (exerciseId: string): string => {
        const exercise = exerciseCategories.breathing.find((ex) => ex.id === exerciseId)
        return exercise?.audioSrc || "/audio/forest-background.mp3"
    }

    // Get meditation voice guidance based on exercise ID
    const getMeditationVoiceGuidance = (exerciseId: string) => {
        const voiceGuidanceMap: Record<string, { intro: string; middle: string; end: string }> = {
            "forest-escape": {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            },
            "ocean-mindfulness": {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            },
            "sereno-zen": {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            },
            "charging-chakras": {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            },
        }

        return (
            voiceGuidanceMap[exerciseId] || {
                intro: "/audio/forest-intro.mp3",
                middle: "/audio/forest-middle.mp3",
                end: "/audio/forest-end.mp3",
            }
        )
    }

    const startBreathingExercise = (exercise: ExerciseItem) => {
        console.log(`Starting breathing exercise: ${exercise.id}`)
        setCurrentExercise(exercise.id)
        setCurrentView("breathing")
        setIsActive(true)
        setIsPaused(false)
        setCurrentPhase("inhale")
        setIsFirstCycle(true)
        setTimeRemaining(sessionDuration)

        if (audioEnabled && isInitialized && exercise.audioSrc) {
            playBackgroundAudio(exercise.audioSrc, true, 0.3).catch(() => {
                console.warn(`Could not play background audio for ${exercise.id}, continuing without audio`)
            })
        }
    }

    const startMeditationSession = (exercise: ExerciseItem) => {
        console.log(`Starting meditation session: ${exercise.id}`)

        // Type guard to check if exercise is a meditation exercise
        const isMeditationExercise = (ex: ExerciseItem): ex is (typeof exerciseCategories.meditation)[0] => {
            return ex.category === "meditation"
        }

        // Convert to MeditationSession format with proper voice guidance
        const meditationSession = {
            id: exercise.id,
            title: exercise.title,
            description: exercise.description,
            category: exercise.category,
            tags: exercise.tags,
            audioSrc: exercise.audioSrc,
            videoSrc: isMeditationExercise(exercise) ? exercise.videoSrc : "",
            thumbnailSrc: isMeditationExercise(exercise) ? exercise.thumbnailSrc : "",
            instructor: "Sereno Guide",
            duration: sessionDuration,
            voiceGuidance: getMeditationVoiceGuidance(exercise.id),
        } satisfies MeditationSession

        setCurrentSession(meditationSession)
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
        setIsFirstCycle(true)
        // Stop ALL audio when returning to home
        stopBackgroundAudio()
        stopAudio() // This stops voice guidance audio
    }

    const handlePlayPause = () => {
        setIsPaused(!isPaused)

        if (isPaused) {
            if (audioEnabled && isInitialized) {
                if (currentView === "breathing") {
                    const backgroundAudio = getExerciseBackgroundAudio(currentExercise)
                    if (backgroundAudio) {
                        playBackgroundAudio(backgroundAudio, true, 0.3).catch(() => {
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
            stopAudio() // Also stop voice guidance when pausing
        }
    }

    const handleRestart = () => {
        setCurrentPhase("inhale")
        setIsPaused(false)
        setIsFirstCycle(true)
        setTimeRemaining(sessionDuration)

        // Stop all audio before restarting
        stopBackgroundAudio()
        stopAudio()

        if (audioEnabled && isInitialized) {
            if (currentView === "breathing") {
                const backgroundAudio = getExerciseBackgroundAudio(currentExercise)
                if (backgroundAudio) {
                    playBackgroundAudio(backgroundAudio, true, 0.3).catch(() => {
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

    const handleSelectExercise = (exercise: ExerciseItem) => {
        setSelectedExercise(exercise)
    }

    const handleStartExercise = (exercise: ExerciseItem) => {
        if (exercise.category === "breathing") {
            startBreathingExercise(exercise)
        } else if (exercise.category === "meditation") {
            startMeditationSession(exercise)
        }
    }

    const handleAudioToggle = () => {
        setAudioEnabled(!audioEnabled)
    }

    // Render functions
    const renderBreathingPreviewAction = (exercise: ExerciseItem | null) => {
        if (!exercise) return null

        switch (exercise.id) {
            case "quick-calm":
                return <QuickCalm isActive={false} isPaused={true} currentPhase={currentPhase} isLightTheme={isLightTheme} />
            case "deep-focus":
                return <DeepFocus isPaused={true} />
            case "morning-energize":
                return (
                    <MorningEnergize isActive={false} isPaused={true} currentPhase={currentPhase} isLightTheme={isLightTheme} />
                )
            case "souffle-de-vador":
                return (
                    <SouffleDeVador isActive={false} isPaused={true} currentPhase={currentPhase} isLightTheme={isLightTheme} />
                )
            default:
                return null
        }
    }

    const renderHeaderMenu = () => (
        <header className="fixed top-0 left-20 right-16 lg:left-24 lg:right-18 h-12 md:h-16 lg:h-20 bg-black/95 backdrop-blur-sm border-b border-white/10 z-40 flex items-center">
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

    const renderAudioFooter = () => (
        <div className="fixed bottom-1 left-22 right-20 md:bottom-3 md:left-24 md:right-22 lg:bottom-4 lg:left-28 lg:right-24 z-50">
            <div className="w-full px-2 py-1.5 md:px-4 md:py-2.5 lg:px-6 lg:py-3 rounded-lg md:rounded-xl lg:rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 shadow-lg">
                <AudioFooter
                    isPlaying={isPlaying}
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
                {/* System Dock - Keep visible in breathing view */}
                <div className="fixed left-0 top-0 bottom-0 w-20 lg:w-24 z-50">
                    <SystemDock />
                </div>

                <div className="fixed top-2 left-24 md:top-4 md:left-28 lg:top-6 lg:left-30 z-50">
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

                <div className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none p-2 md:p-6 lg:p-8">
                    <BreathingTimer
                        duration={sessionDuration}
                        timeRemaining={timeRemaining}
                        isPlaying={isPlaying}
                        currentPhase={currentPhase}
                        onPhaseChangeAction={handlePhaseChange}
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
                {/* System Dock - Keep visible in meditation view */}
                <div className="fixed left-0 top-0 bottom-0 w-20 lg:w-24 z-50">
                    <SystemDock />
                </div>

                <div className="fixed top-2 left-24 md:top-4 md:left-28 lg:top-6 lg:left-30 z-50">
                    <BackButton onBack={returnToHome} exerciseTitle={currentSession.title} />
                </div>

                <div className="absolute inset-0">
                    <MeditationSessionView
                        session={currentSession}
                        volume={volume}
                        isPlaying={isPlaying}
                        voiceEnabled={voiceEnabled}
                        audioEnabled={audioEnabled}
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
                                exercises={
                                    activeTab === "breathing" ? [...exerciseCategories.breathing] : [...exerciseCategories.meditation]
                                }
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
