// Simple scenario types
export type ScenarioType = "morning-commute" | "highway-drive" | "traffic-jam" | "scenic-drive" | "ev-charging"

// Simple scenario data
export const scenarios = {
    "morning-commute": {
        title: "Morning Commute",
        description: "Start your day with mindful breathing during your commute",
        exercise: "Deep Focus",
        exerciseDescription: "Enhance concentration and mental clarity",
        mapCenter: [37.7749, -122.4194], // San Francisco
        isMoving: true,
        isCharging: false,
    },
    "highway-drive": {
        title: "Highway Drive",
        description: "Stay calm and focused during long highway drives",
        exercise: "Quick Calm",
        exerciseDescription: "Reduce stress and maintain focus",
        mapCenter: [34.0522, -118.2437], // Los Angeles
        isMoving: true,
        isCharging: false,
    },
    "traffic-jam": {
        title: "Traffic Jam",
        description: "Manage stress during frustrating traffic situations",
        exercise: "Souffle de Vador",
        exerciseDescription: "Control breathing for stress reduction",
        mapCenter: [40.7128, -74.006], // New York
        isMoving: true,
        isCharging: false,
    },
    "scenic-drive": {
        title: "Scenic Drive",
        description: "Enhance your enjoyment of beautiful routes",
        exercise: "Morning Energize",
        exerciseDescription: "Boost energy and awareness",
        mapCenter: [36.8866, -111.5104], // Grand Canyon area
        isMoving: true,
        isCharging: false,
    },
    "ev-charging": {
        title: "EV Charging",
        description: "Make the most of your charging time",
        exercise: "Deep Focus",
        exerciseDescription: "Enhance concentration and mental clarity",
        mapCenter: [37.7749, -122.4194], // San Francisco
        isMoving: false,
        isCharging: true,
    },
}

// Current active scenario
let activeScenario: ScenarioType | null = null

// Get current scenario
export function getCurrentScenario() {
    return activeScenario ? scenarios[activeScenario] : null
}

// Set active scenario
export function setScenario(scenario: ScenarioType | null) {
    activeScenario = scenario
    return activeScenario ? scenarios[activeScenario] : null
}
