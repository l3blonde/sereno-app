export interface BreathingExercise {
  id: string
  name: string
  description: string
  duration: number
  pattern: {
    inhale: number
    hold1: number
    exhale: number
    hold2: number
  }
  color?: string
  theme?: string
  backgroundMusic?: string
  inhaleSound?: string
  exhaleSound?: string
  holdSound?: string
  themeColor?: string
  image?: string
}

export interface MeditationExperience {
  id: string
  name: string
  description: string
  duration: number
  guidanceText?: string[]
  backgroundSounds?: string[]
  theme?: string
}

// Breathing exercises data
export const breathingExercises: BreathingExercise[] = [
  {
    id: "quick-calm",
    name: "QUICK CALM",
    description: "A short exercise to quickly calm your nerves.",
    duration: 2,
    pattern: {
      inhale: 4,
      hold1: 2,
      exhale: 6,
      hold2: 2,
    },
    color: "bg-gradient-green",
    theme: "forest",
    backgroundMusic: "/audio/forest-background.mp3",
    themeColor: "#00B34C",
    image: "/images/quick-calm.jpg",
  },
  {
    id: "deep-focus",
    name: "DEEP FOCUS",
    description: "Enhance focus and concentration with deep breathing.",
    duration: 5,
    pattern: {
      inhale: 4,
      hold1: 4,
      exhale: 4,
      hold2: 4,
    },
    color: "bg-gradient-blue-indigo",
    theme: "focus",
    themeColor: "#0074B5",
    backgroundMusic: "/audio/deep-focus.mp3",
    inhaleSound: "/audio/inhale.mp3",
    exhaleSound: "/audio/exhale.mp3",
    image: "/images/deep-focus.jpg",
  },
  {
    id: "morning-energize",
    name: "MORNING ENERGIZE",
    description: "Start your day with an energizing breath.",
    duration: 3,
    pattern: {
      inhale: 6,
      hold1: 0,
      exhale: 4,
      hold2: 0,
    },
    color: "bg-gradient-yellow-orange",
    theme: "morning",
    themeColor: "#FF9500",
    backgroundMusic: "/audio/morning-energize.mp3",
    inhaleSound: "/audio/inhale.mp3",
    exhaleSound: "/audio/exhale.mp3",
    image: "/images/morning-energize.jpg",
  },
  {
    id: "evening-wind-down",
    name: "EVENING WIND DOWN",
    description: "Relax and prepare for sleep with this calming exercise.",
    duration: 4,
    pattern: {
      inhale: 4,
      hold1: 0,
      exhale: 8,
      hold2: 0,
    },
    color: "bg-gradient-indigo-purple",
    theme: "evening",
    themeColor: "#8A2BE2",
    backgroundMusic: "/audio/evening-wind-down.mp3",
    inhaleSound: "/audio/inhale.mp3",
    exhaleSound: "/audio/exhale.mp3",
    image: "/images/evening-wind-down.jpg",
  },
  {
    id: "souffle-de-vador",
    name: "SOUFFLE DE VADOR",
    description: "Embrace the dark side with this powerful breathing technique. Feel the force!",
    duration: 3,
    pattern: {
      inhale: 2,
      hold1: 1,
      exhale: 4,
      hold2: 1,
    },
    color: "bg-gradient-to-br from-red-900 to-black",
    theme: "vader",
    backgroundMusic: "/audio/imperialMarch.mp3",
    inhaleSound: "/audio/vaderInhale.mp3",
    exhaleSound: "/audio/vaderExhale.mp3",
    holdSound: "/audio/lightsaber.mp3",
    themeColor: "#CF0000",
    image: "/images/souffle-de-vador.jpg",
  },
  {
    id: "jedi-breath",
    name: "JEDI BREATH",
    description: "Clear your mind, you must. Patience and focus, this breath will bring.",
    duration: 4,
    pattern: {
      inhale: 4,
      hold1: 2,
      exhale: 4,
      hold2: 0,
    },
    color: "bg-gradient-to-br from-blue-500 to-green-500",
    theme: "jedi",
    backgroundMusic: "/audio/jediTheme.mp3",
    themeColor: "#00B2FF",
    inhaleSound: "/audio/inhale.mp3",
    exhaleSound: "/audio/exhale.mp3",
    image: "/images/jedi-breath.jpg",
  },
]

export const exercises = breathingExercises
