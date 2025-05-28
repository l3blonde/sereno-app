// Add this debugging code at the top of the file to check the guidance texts
// This will help us verify if there are multiple guidance texts available
console.log("Loading meditation experiences data")

export interface MeditationExperience {
    id: string
    name: string
    description: string
    duration: number
    type: "video" | "animation" | "standard"
    backgroundType?: "video" | "particles" | "3d" | "image"
    backgroundSrc?: string
    audioSrc?: string
    guidanceText?: string[]
    theme?: string
    progressStages?: {
        time: number // in seconds
        message: string
    }[]
    image?: string
}

// Meditation experiences data
export const meditationExperiences: MeditationExperience[] = [
    {
        id: "forest-escape",
        name: "FOREST ESCAPE",
        description: "An immersive journey through a peaceful forest landscape.",
        duration: 5,
        type: "video",
        backgroundType: "video",
        backgroundSrc: "/videos/forest-background.mp4",
        audioSrc: "/audio/forest-background.mp3",
        guidanceText: [
            "Find a comfortable position and close your eyes.",
            "Take a deep breath in through your nose...",
            "And exhale slowly through your mouth...",
            "Imagine yourself walking through a lush, green forest...",
            "Feel the soft earth beneath your feet...",
            "Listen to the gentle sounds of nature around you...",
            "Birds singing in the distance...",
            "The rustling of leaves in the breeze...",
            "With each breath, feel yourself becoming more connected to nature...",
            "Allow yourself to be fully present in this moment...",
            "Breathe in the fresh forest air...",
            "And exhale any tension or stress...",
            "Continue breathing deeply and naturally...",
        ],
        progressStages: [
            { time: 0, message: "Begin your journey at the forest edge" },
            { time: 60, message: "Moving deeper into the forest" },
            { time: 120, message: "Finding a peaceful clearing" },
            { time: 180, message: "Sitting beside a gentle stream" },
            { time: 240, message: "Feeling completely at peace with nature" },
        ],
        theme: "forest",
        image: "/images/forest-escape.jpg",
    },
    {
        id: "ocean-mindfulness",
        name: "OCEAN MINDFULNESS",
        description: "A calming deep sea meditation experience.",
        duration: 7,
        type: "video",
        backgroundType: "video",
        backgroundSrc: "/videos/ocean-background.mp4",
        audioSrc: "/audio/ocean-background.mp3",
        guidanceText: [
            "Settle into a comfortable position...",
            "Begin by taking a few deep breaths...",
            "Imagine yourself standing at the edge of the ocean...",
            "Feel the cool water gently touching your feet...",
            "Watch the waves roll in and out...",
            "Notice how they mirror your breathing...",
            "As you inhale, the wave builds...",
            "As you exhale, the wave recedes...",
            "Feel the rhythm of the ocean becoming your own...",
            "Let your thoughts come and go like passing waves...",
            "There is no need to hold onto them...",
            "Just observe them as they appear and dissolve...",
            "Continue breathing with the rhythm of the ocean...",
        ],
        progressStages: [
            { time: 0, message: "Standing at the shore" },
            { time: 90, message: "Wading into the gentle waves" },
            { time: 180, message: "Floating on the surface" },
            { time: 270, message: "Diving into the calm depths" },
            { time: 360, message: "Finding peace in the ocean's embrace" },
        ],
        theme: "ocean",
        image: "/images/ocean-mindfulness.jpg",
    },
    {
        id: "sereno-zen",
        name: "ZEN AT 200 MPH",
        description: "A guided meditation for high-performance minds... and even higher-performance vehicles.",
        duration: 6,
        type: "video",
        backgroundType: "video",
        backgroundSrc: "/videos/porsche-mountain-driv.mp4", // Updated to correct filename
        audioSrc: "/audio/sereno-mountain-drive.mp3",
        guidanceText: [
            "Welcome, driver. Please park your ego in neutral...",
            "Close your eyes — yes, even if they're hidden behind designer shades.",
            "Feel the fine leather beneath you. You are seated in luxury... and maybe on some unresolved tension.",
            "Inhale deeply. Smell that? It's success... and a hint of premium fuel.",
            "Exhale... releasing stress like letting off the gas on a hairpin turn.",
            "You are not in a race. Except, of course, against your own expectations.",
            "Notice the purr of your inner engine — smooth, powerful, slightly judgmental.",
            "You are in control... even if you usually let the sport mode do the work.",
            "Remember: true stillness doesn't require carbon ceramic brakes.",
        ],
        progressStages: [
            { time: 0, message: "Entering the scenic route to self-awareness" },
            { time: 90, message: "Switching from turbo mode to chill mode" },
            { time: 180, message: "Downshifting ego, upshifting presence" },
            { time: 270, message: "Cruising through the curves of your consciousness" },
            { time: 360, message: "Arriving at Inner Peace, valet not included" },
        ],
        theme: "luxury-drive",
        image: "/images/sereno-zen.jpg",
    },
    {
        id: "charging-chakras",
        name: "CHARGING CHAKRAS",
        description:
            "A parking lot-powered yoga experience to harmonize your breath, your battery, and your body while your EV charges.",
        duration: 8,
        type: "video",
        backgroundType: "video",
        backgroundSrc: "/videos/charging-chakras.mp4",
        audioSrc: "/audio/charging-chakras.mp3",
        guidanceText: [
            "Begin by placing your phone down... unless you're using it to check the charging percentage. That's valid.",
            "Take a deep breath in through your nose...",
            "And exhale through your mouth like you're cooling off a hot steering wheel.",
            "Feel your energy syncing with the gentle hum of electrons flowing into your vehicle...",
            "Stretch your arms overhead — mind the ceiling if you're still inside the car.",
            "Gently rotate your neck left... to make eye contact with the guy at the next charger. Smile awkwardly.",
            "Now slowly roll down your window of resistance...",
            "Breathe in patience. Exhale range anxiety.",
            "Feel your inner battery reaching 100%. Cable still attached? So are you — to the moment.",
        ],
        progressStages: [
            { time: 0, message: "Standing at the charging station" },
            { time: 120, message: "Finding balance between convenience and patience" },
            { time: 240, message: "Syncing with your vehicle's energy flow" },
            { time: 360, message: "Reaching optimal charge state" },
            { time: 420, message: "Fully energized and ready to continue your journey" },
        ],
        theme: "electric",
        image: "/images/charging-chakras.jpg",
    },
]

export const experiences = meditationExperiences
