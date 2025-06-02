/**
 * lib/meditation/meditation-data.ts
 * Data module for meditation sessions including metadata,
 * audio/video paths, and utility functions for accessing sessions.
 */
export interface MeditationSession {
    id: string
    title: string
    description: string
    category: string
    tags: string[]
    instructor: string
    duration: number
    audioSrc: string
    videoSrc: string
    thumbnailSrc: string
    voiceGuidance?: {
        intro: string
        middle: string
        end: string
    }
}

export const meditationSessions: MeditationSession[] = [
    {
        id: "forest-escape",
        title: "Forest Escape",
        description: "Find peace in a virtual forest environment with guided meditation to help you disconnect and relax.",
        category: "meditation",
        tags: ["relax", "nature"],
        instructor: "Sarah Chen",
        duration: 600, // 10 minutes
        audioSrc: "/audio/forest-background.mp3",
        videoSrc: "/videos/forest-background.mp4",
        thumbnailSrc: "/thumbnails/forest-escape.png",
        voiceGuidance: {
            intro: "/audio/meditation/forest-intro.mp3",
            middle: "/audio/meditation/forest-middle.mp3",
            end: "/audio/meditation/forest-end.mp3",
        },
    },
    {
        id: "ocean-mindfulness",
        title: "Ocean Mindfulness",
        description:
            "Let the rhythm of ocean waves guide you to a state of calm and mindfulness with this meditation session.",
        category: "meditation",
        tags: ["relax", "nature"],
        instructor: "Michael Torres",
        duration: 900, // 15 minutes
        audioSrc: "/audio/ocean-background.mp3",
        videoSrc: "/videos/ocean-background.mp4",
        thumbnailSrc: "/thumbnails/ocean-mindfulness.png",
        voiceGuidance: {
            intro: "/audio/meditation/ocean-intro.mp3",
            middle: "/audio/meditation/ocean-middle.mp3",
            end: "/audio/meditation/ocean-end.mp3",
        },
    },
    {
        id: "sereno-zen",
        title: "Sereno Zen",
        description: "Focus at high speeds with this meditation designed specifically for drivers seeking mental clarity.",
        category: "meditation",
        tags: ["focus", "driving"],
        instructor: "Alex Morgan",
        duration: 480, // 8 minutes
        audioSrc: "/audio/sereno-mountain-drive.mp3",
        videoSrc: "/videos/porsche-mountain-drive.mp4",
        thumbnailSrc: "/thumbnails/sereno-zen.png",
        voiceGuidance: {
            intro: "/audio/meditation/zen-intro.mp3",
            middle: "/audio/meditation/zen-middle.mp3",
            end: "/audio/meditation/zen-end.mp3",
        },
    },
    {
        id: "charging-chakras",
        title: "Charging Chakras",
        description:
            "Energize while charging your vehicle with this meditation focused on revitalizing your energy centers.",
        category: "meditation",
        tags: ["vitalize", "energy"],
        instructor: "Elena Rodriguez",
        duration: 720, // 12 minutes
        audioSrc: "/audio/charging-chakras.mp3",
        videoSrc: "/videos/charging-chakras.mp4",
        thumbnailSrc: "/thumbnails/charging-chakras.png",
        voiceGuidance: {
            intro: "/audio/meditation/chakras-intro.mp3",
            middle: "/audio/meditation/chakras-middle.mp3",
            end: "/audio/meditation/chakras-end.mp3",
        },
    },
]
