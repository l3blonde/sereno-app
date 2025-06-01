"use client"

import { useState } from "react"
import { MindfulTestQuiz } from "./mindful-test-quiz"

export function RCTLabDashboard() {
    const [showTest, setShowTest] = useState(false)

    const handleStartTest = () => {
        console.log("🧪 Starting test...")
        setShowTest(true)
    }

    const handleTestComplete = (data: {
        userData: {
            name: string
            age: number
            location: string
            profession: string
            drives: boolean
            car: string
        }
        responses: {
            wellnessFrequency: string
            findSession: string
            voiceGuidance: string
            audioPlayer: string
            breakChoice: string
            languagePreference: string
            musicPreference: string
            musicOther?: string
            interfaceEase: string
            confusing: string
            confusingExplanation?: string
            suggestions: string
            wouldUseAgain: string
            whyUseAgain: string
        }
        completed: boolean
        timestamp: Date
    }) => {
        console.log("🏁 Test completed:", data)
        setShowTest(false)
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {showTest ? (
                <MindfulTestQuiz onCompleteAction={handleTestComplete} />
            ) : (
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-12 text-center">
                            <h1 className="text-4xl font-bold mb-4">RCT Lab</h1>
                            <p className="text-xl text-gray-400">Research & Concept Testing Laboratory for Sereno</p>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-8 mb-8">
                            <h2 className="text-2xl font-bold mb-4">Mindfulness Test</h2>
                            <p className="text-gray-300 mb-6">
                                Help us improve Sereno by participating in our user research. This short test will gather your feedback
                                on the app&apos;s features and usability.
                            </p>
                            <button
                                onClick={handleStartTest}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                Start Test
                            </button>
                        </div>

                        <div className="bg-gray-900 rounded-xl p-8">
                            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
                            <p className="text-gray-300 mb-6">
                                View and analyze the results of our user testing. Access detailed reports and insights.
                            </p>
                            <a
                                href="/admin/test-results"
                                className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                            >
                                View Results
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
