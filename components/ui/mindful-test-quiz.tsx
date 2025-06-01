/**
 * components/ui/mindful-test-quiz.tsx
 * Simplified 15-question user testing component for Sereno PWA
 */
"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, User, CheckCircle, Download } from "lucide-react"

interface UserData {
    name: string
    age: number
    location: string
    profession: string
    drives: boolean
    car: string
}

interface TestResponses {
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

interface QuizData {
    userData: UserData
    responses: TestResponses
    completed: boolean
    timestamp: Date
}

export function MindfulTestQuiz({ onCompleteAction }: { onCompleteAction: (data: QuizData) => void }) {
    const [currentStep, setCurrentStep] = useState(0) // 0: intro, 1: user info, 2: questions, 3: complete
    const [userData, setUserData] = useState<UserData>({
        name: "",
        age: 0,
        location: "",
        profession: "",
        drives: false,
        car: "",
    })
    const [responses, setResponses] = useState<TestResponses>({
        wellnessFrequency: "",
        findSession: "",
        voiceGuidance: "",
        audioPlayer: "",
        breakChoice: "",
        languagePreference: "",
        musicPreference: "",
        musicOther: "",
        interfaceEase: "",
        confusing: "",
        confusingExplanation: "",
        suggestions: "",
        wouldUseAgain: "",
        whyUseAgain: "",
    })
    const totalSteps = 4
    const progress = (currentStep / (totalSteps - 1)) * 100

    const submitTestResults = async (data: QuizData) => {
        try {
            console.log("🚀 === SUBMITTING TEST RESULTS ===")
            console.log("📊 Data being sent:", JSON.stringify(data, null, 2))

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

            console.log("📡 Response status:", response.status)
            console.log("📋 Response headers:", Object.fromEntries(response.headers.entries()))

            const result = await response.json()
            console.log("✅ API Response:", result)

            if (!response.ok) {
                console.error("❌ API Error:", response.status, result)
                alert(`Error saving test results: ${result.error || "Unknown error"}`)
                return false
            }

            console.log("🎉 Test results submitted successfully:", result)
            alert("✅ Test results saved successfully!")
            return true
        } catch (error) {
            console.error("🔥 Network Error:", error)
            alert(`❌ Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
            return false
        }
    }

    const handleNext = async () => {
        console.log("🔄 handleNext called, currentStep:", currentStep, "totalSteps:", totalSteps)

        if (currentStep === 1) {
            // Validate user data
            if (!userData.name || !userData.age) {
                console.log("❌ Validation failed: missing name or age")
                return
            }
            console.log("✅ User data validation passed")
        }

        // Check if we're at the final step (step 2 = questions, step 3 = completion)
        if (currentStep === 2) {
            console.log("🏁 COMPLETING QUIZ - FINAL STEP")

            // Complete quiz and submit data
            const quizData: QuizData = {
                userData,
                responses,
                completed: true,
                timestamp: new Date(),
            }

            console.log("📝 Final quiz data:", quizData)

            // Submit to API FIRST
            const success = await submitTestResults(quizData)
            console.log("💾 Submission result:", success)

            // ALWAYS call onCompleteAction regardless of submission success
            console.log("🎯 Calling onCompleteAction with data:", quizData)
            try {
                onCompleteAction(quizData)
                console.log("✅ onCompleteAction called successfully")
            } catch (error) {
                console.error("❌ Error calling onCompleteAction:", error)
            }

            // Move to completion step
            setCurrentStep(3)
        } else if (currentStep < totalSteps - 1) {
            console.log("➡️ Moving to next step")
            setCurrentStep((prev) => prev + 1)
        } else {
            console.log("⚠️ Already at final step, no action needed")
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const renderIntro = () => (
        <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <User size={32} className="text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Sereno App – User Test</h2>
                <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                    Welcome! This quick test helps us understand how Sereno supports your wellbeing and focus in real car-related
                    moments.
                </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-6 max-w-xl mx-auto">
                <h3 className="text-white font-semibold mb-3">What to expect:</h3>
                <ul className="text-gray-300 text-left space-y-2">
                    <li>• 5 minutes of questions</li>
                    <li>• Test the Sereno app experience</li>
                    <li>• Share your feedback</li>
                    <li>• For drivers & non-drivers</li>
                </ul>
            </div>
        </div>
    )

    const renderUserInfo = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Participant Info</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white font-semibold mb-2">Name *</label>
                    <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label className="block text-white font-semibold mb-2">Age *</label>
                    <input
                        type="number"
                        value={userData.age || ""}
                        onChange={(e) => setUserData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                        placeholder="Your age"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-white font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        value={userData.location}
                        onChange={(e) => setUserData((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                        placeholder="City, Country"
                    />
                </div>
                <div>
                    <label className="block text-white font-semibold mb-2">Profession</label>
                    <input
                        type="text"
                        value={userData.profession}
                        onChange={(e) => setUserData((prev) => ({ ...prev, profession: e.target.value }))}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
                        placeholder="Your profession"
                    />
                </div>
            </div>

            <div>
                <label className="block text-white font-semibold mb-3">Do you drive a car? If yes, which one?</label>
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="drives"
                            checked={userData.drives}
                            onChange={() => setUserData((prev) => ({ ...prev, drives: true }))}
                            className="text-white"
                        />
                        Yes — Model:
                        <input
                            type="text"
                            value={userData.car}
                            onChange={(e) => setUserData((prev) => ({ ...prev, car: e.target.value }))}
                            className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white flex-1"
                            placeholder="e.g., Tesla Model 3, BMW X5"
                            disabled={!userData.drives}
                        />
                    </label>
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="drives"
                            checked={!userData.drives}
                            onChange={() => setUserData((prev) => ({ ...prev, drives: false, car: "" }))}
                            className="text-white"
                        />
                        No
                    </label>
                </div>
            </div>
        </div>
    )

    const renderQuestions = () => (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-white text-center mb-6">Sereno Experience</h2>

            {/* Question 1 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    How often do you do breathing, meditation, or wellness activities?
                </label>
                <div className="space-y-2">
                    {["Daily", "A few times a week", "Rarely", "Never"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="wellnessFrequency"
                                value={option}
                                checked={responses.wellnessFrequency === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, wellnessFrequency: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Scenario Description */}
            <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-3">Midday Stress Reset</h3>
                <p className="text-gray-300 mb-3">
                    <strong>Situation:</strong> You&apos;ve just had a stressful video call and step into your car for a mental
                    reset.
                </p>
                <p className="text-blue-300 italic">
                    <strong>Task:</strong> Open the Sereno app, tap the &apos;Breathe&apos; button, choose a quick calm breathing
                    exercise, set the timer for 2 minutes, and use it to help you reset mentally.
                </p>
            </div>

            {/* Question 2 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    Was it easy to find and start the &quot;Morning Energise&quot; session?
                </label>
                <div className="space-y-2">
                    {["Yes", "Took me a while", "No"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="findSession"
                                value={option}
                                checked={responses.findSession === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, findSession: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Question 3 */}
            <div>
                <label className="block text-white font-semibold mb-3">How clear was the breathing voice guidance?</label>
                <div className="space-y-2">
                    {["Very clear", "Somewhat clear", "Not clear", "Didn't notice any"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="voiceGuidance"
                                value={option}
                                checked={responses.voiceGuidance === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, voiceGuidance: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Question 4 */}
            <div>
                <label className="block text-white font-semibold mb-3">How was the audio player to use?</label>
                <div className="space-y-2">
                    {["Easy and clear", "Okay", "A bit confusing"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="audioPlayer"
                                value={option}
                                checked={responses.audioPlayer === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, audioPlayer: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Question 5 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    If you had 10–15 minutes during a break (like charging), what would you choose?
                </label>
                <div className="space-y-2">
                    {["Breathing session", "Meditation", "Music"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="breakChoice"
                                value={option}
                                checked={responses.breakChoice === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, breakChoice: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="breakChoice"
                            value="Something else"
                            checked={responses.breakChoice === "Something else"}
                            onChange={(e) => setResponses((prev) => ({ ...prev, breakChoice: e.target.value }))}
                            className="text-white"
                        />
                        Something else:
                        <input
                            type="text"
                            className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white flex-1"
                            placeholder="Please specify"
                            disabled={responses.breakChoice !== "Something else"}
                        />
                    </label>
                </div>
            </div>

            {/* Question 6 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    Would you like to see sessions in your own language (e.g., Dutch, French, Chinese)?
                </label>
                <div className="space-y-2">
                    {["Yes", "No"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="languagePreference"
                                value={option}
                                checked={responses.languagePreference === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, languagePreference: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Question 7 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    What type of sounds or music would you enjoy during a long motorway drive?
                </label>
                <div className="space-y-2">
                    {["Ocean", "Forest", "House/Ibiza"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="musicPreference"
                                value={option}
                                checked={responses.musicPreference === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, musicPreference: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="musicPreference"
                            value="Other"
                            checked={responses.musicPreference === "Other"}
                            onChange={(e) => setResponses((prev) => ({ ...prev, musicPreference: e.target.value }))}
                            className="text-white"
                        />
                        Other:
                        <input
                            type="text"
                            value={responses.musicOther || ""}
                            onChange={(e) => setResponses((prev) => ({ ...prev, musicOther: e.target.value }))}
                            className="ml-2 p-2 rounded bg-gray-800 border border-gray-600 text-white flex-1"
                            placeholder="Please specify"
                            disabled={responses.musicPreference !== "Other"}
                        />
                    </label>
                </div>
            </div>

            {/* Question 8 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    Was the app interface easy to use at a glance while in the car?
                </label>
                <div className="space-y-2">
                    {["Yes", "Somewhat", "No"].map((option) => (
                        <label key={option} className="flex items-center gap-2 text-gray-300">
                            <input
                                type="radio"
                                name="interfaceEase"
                                value={option}
                                checked={responses.interfaceEase === option}
                                onChange={(e) => setResponses((prev) => ({ ...prev, interfaceEase: e.target.value }))}
                                className="text-white"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>

            {/* Question 9 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    Was anything confusing or hard to understand while using Sereno?
                </label>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="confusing"
                            value="No, everything was clear"
                            checked={responses.confusing === "No, everything was clear"}
                            onChange={(e) => setResponses((prev) => ({ ...prev, confusing: e.target.value }))}
                            className="text-white"
                        />
                        No, everything was clear
                    </label>
                    <label className="flex items-start gap-2 text-gray-300">
                        <input
                            type="radio"
                            name="confusing"
                            value="Yes"
                            checked={responses.confusing === "Yes"}
                            onChange={(e) => setResponses((prev) => ({ ...prev, confusing: e.target.value }))}
                            className="text-white mt-1"
                        />
                        <div className="flex-1">
                            Yes — please explain:
                            <textarea
                                value={responses.confusingExplanation || ""}
                                onChange={(e) => setResponses((prev) => ({ ...prev, confusingExplanation: e.target.value }))}
                                className="w-full mt-2 p-2 rounded bg-gray-800 border border-gray-600 text-white h-16"
                                placeholder="Please explain..."
                                disabled={responses.confusing !== "Yes"}
                            />
                        </div>
                    </label>
                </div>
            </div>

            {/* Question 10 */}
            <div>
                <label className="block text-white font-semibold mb-3">Do you have any suggestions to improve the app?</label>
                <textarea
                    value={responses.suggestions}
                    onChange={(e) => setResponses((prev) => ({ ...prev, suggestions: e.target.value }))}
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white h-24"
                    placeholder="Open comment..."
                />
            </div>

            {/* Question 11 */}
            <div>
                <label className="block text-white font-semibold mb-3">
                    Would you use Sereno again to relax, reset, or stay focused? Why or why not?
                </label>
                <div className="space-y-3">
                    <div className="space-y-2">
                        {["Yes", "Maybe", "No"].map((option) => (
                            <label key={option} className="flex items-center gap-2 text-gray-300">
                                <input
                                    type="radio"
                                    name="wouldUseAgain"
                                    value={option}
                                    checked={responses.wouldUseAgain === option}
                                    onChange={(e) => setResponses((prev) => ({ ...prev, wouldUseAgain: e.target.value }))}
                                    className="text-white"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                    <div>
                        <label className="block text-white font-semibold mb-2">Please explain briefly:</label>
                        <textarea
                            value={responses.whyUseAgain}
                            onChange={(e) => setResponses((prev) => ({ ...prev, whyUseAgain: e.target.value }))}
                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white h-20"
                            placeholder="Please explain..."
                        />
                    </div>
                </div>
            </div>
        </div>
    )

    const renderComplete = () => (
        <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-white" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Test Complete!</h2>
                <p className="text-gray-300 text-lg mb-6">
                    Thank you for testing Sereno! Your feedback helps us improve the experience for everyone.
                </p>
                <button
                    onClick={() => {
                        console.log("🔄 Redirecting to admin page...")
                        window.location.href = "/admin/test-results"
                    }}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    View Test Results
                </button>
            </div>
        </div>
    )

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Progress Bar */}
                <div className="w-full bg-gray-800 h-2">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {currentStep === 0 && renderIntro()}
                    {currentStep === 1 && renderUserInfo()}
                    {currentStep === 2 && renderQuestions()}
                    {currentStep === 3 && renderComplete()}
                </div>

                {/* Navigation */}
                <div className="border-t border-gray-700 p-6 flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                        Step {currentStep + 1} of {totalSteps}
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && currentStep < 3 && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                        )}

                        {currentStep < 3 && (
                            <button
                                onClick={() => {
                                    console.log("🔘 Complete Test button clicked!")
                                    handleNext().catch((error) => {
                                        console.error("❌ Error in handleNext:", error)
                                    })
                                }}
                                disabled={currentStep === 1 && (!userData.name || !userData.age)}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                            >
                                {currentStep === 2 ? (
                                    <>
                                        <Download size={16} />
                                        Complete Test
                                    </>
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
