"use client"

import { useState } from "react"
import { Play, Download } from "lucide-react"
import { MindfulTestQuiz } from "./mindful-test-quiz"

interface QuizData {
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
}

export function RCTLabDashboard() {
    const [showQuiz, setShowQuiz] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

    const handleStartTest = () => {
        setShowQuiz(true)
        setSubmitStatus("idle")
    }

    const handleCompleteTest = async (data: QuizData) => {
        setIsSubmitting(true)

        try {
            console.log("Submitting data:", data) // Debug log

            const response = await fetch("/api/test-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userData: data.userData,
                    responses: data.responses,
                }),
            })

            const result = await response.json()
            console.log("API Response:", response.status, result) // Debug log

            if (response.ok && result.success) {
                console.log("Test results saved:", result)
                setSubmitStatus("success")

                // Close quiz after 2 seconds
                setTimeout(() => {
                    setShowQuiz(false)
                    setSubmitStatus("idle")
                }, 2000)
            } else {
                console.error("API Error:", response.status, result)
                setSubmitStatus("error")
            }
        } catch (error) {
            console.error("Network Error:", error)
            setSubmitStatus("error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDownloadResults = () => {
        // Use Next.js router for proper navigation
        window.location.href = "/admin/test-results"
    }

    return (
        <div className="w-full h-full bg-[#0A0A0A] flex flex-col items-center justify-center min-h-screen">
            <div className="max-w-4xl w-full mx-auto p-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="border border-[#2A2A2A] rounded-lg p-6 mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Sereno RCT Lab – Concept Test</h1>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-8 mb-12">
                        <button
                            onClick={handleStartTest}
                            disabled={isSubmitting}
                            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 rounded-lg shadow-lg"
                        >
                            <Play size={24} />
                            {isSubmitting ? "Saving Results..." : "Start Sereno User Test"}
                        </button>

                        <button
                            onClick={handleDownloadResults}
                            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                        >
                            <Download size={24} />
                            Download User Test Results PDF
                        </button>
                    </div>

                    {/* Status Messages */}
                    {submitStatus === "success" && (
                        <div className="mb-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-center">
                            <p className="text-green-300">✅ Test results saved successfully!</p>
                        </div>
                    )}

                    {submitStatus === "error" && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center">
                            <p className="text-red-300">❌ Failed to save test results. Please try again.</p>
                        </div>
                    )}

                    {/* Welcome Section */}
                    <div className="text-center space-y-6">
                        <h2 className="text-xl font-bold text-white">Welcome to the Sereno Experience Test 🚗 For all users</h2>

                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                            This quick test helps us understand how Sereno supports your wellbeing and focus in real car-related
                            moments. Drivers, & non-drivers.
                        </p>

                        <p className="text-gray-400 text-lg">Takes about 5 minutes</p>
                    </div>
                </div>
            </div>

            {/* Quiz Modal - Removed onClose prop since it's not needed */}
            {showQuiz && <MindfulTestQuiz onCompleteAction={handleCompleteTest} />}
        </div>
    )
}
