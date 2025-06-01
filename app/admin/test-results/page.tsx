"use client"

import { useState, useEffect } from "react"
import { Download, Users, Calendar, BarChart3, Eye } from "lucide-react"
import { jsPDF } from "jspdf"

interface TestResult {
    id: string
    user_data: {
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
        interfaceEase: string
        confusing: string
        suggestions: string
        wouldUseAgain: string
        whyUseAgain: string
    }
    created_at: string
    test_version: string
}

export default function TestResultsPage() {
    const [results, setResults] = useState<TestResult[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
    const [stats, setStats] = useState({
        total: 0,
        thisWeek: 0,
        completionRate: 0,
    })

    useEffect(() => {
        const loadResults = async () => {
            try {
                await fetchResults()
            } catch (error) {
                console.error("Failed to load results:", error)
            }
        }

        void loadResults()
    }, [])

    const fetchResults = async () => {
        try {
            console.log("=== Fetching test results ===")

            const response = await fetch("/api/test-results")
            console.log("Fetch response status:", response.status)

            if (!response.ok) {
                // Handle non-OK responses before trying to parse JSON
                console.error("API Error:", response.status, response.statusText)

                try {
                    // Try to parse error response as JSON
                    const errorData = await response.json()
                    console.error("Error details:", errorData)
                    alert(`Error fetching results: ${errorData.error || "Unknown error"}`)
                } catch {
                    // If JSON parsing fails, use status text
                    alert(`Error fetching results: ${response.statusText}`)
                }

                return
            }

            const data = await response.json()
            console.log("Fetched data:", data)

            setResults(data.data || [])
            console.log("Set results:", data.data?.length || 0, "records")

            // Calculate stats
            const total = data.total || 0
            const oneWeekAgo = new Date()
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

            const thisWeek = data.data?.filter((result: TestResult) => new Date(result.created_at) > oneWeekAgo).length || 0

            setStats({
                total,
                thisWeek,
                completionRate: total > 0 ? 100 : 0,
            })

            console.log("Updated stats:", { total, thisWeek })
        } catch (error) {
            console.error("Error fetching results:", error)
            alert(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setLoading(false)
        }
    }

    const generateBeautifulPDF = async () => {
        if (results.length === 0) {
            alert("No test results to export")
            return
        }

        const pdf = new jsPDF("p", "mm", "a4") // Portrait orientation
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 20 // Page margins

        // Clean color palette
        const colors = {
            black: [0, 0, 0],
            darkGray: [60, 60, 60],
            mediumGray: [120, 120, 120],
            lightGray: [240, 240, 240],
            white: [255, 255, 255],
            accent: [41, 128, 185], // Blue accent
        }

        const setColor = (colorArray: number[]) => {
            pdf.setFillColor(colorArray[0], colorArray[1], colorArray[2])
        }

        const setTextColor = (colorArray: number[]) => {
            pdf.setTextColor(colorArray[0], colorArray[1], colorArray[2])
        }

        const addRect = (x: number, y: number, width: number, height: number, colorArray: number[]) => {
            setColor(colorArray)
            pdf.rect(x, y, width, height, "F")
        }

        const addPage = () => {
            pdf.addPage("p")
        }

        // PAGE 1: COVER PAGE
        setColor(colors.white)
        pdf.rect(0, 0, pageWidth, pageHeight, "F")

        // Header section
        addRect(margin, margin, pageWidth - 2 * margin, 60, colors.accent)

        // Title
        setTextColor(colors.white)
        pdf.setFontSize(36)
        pdf.setFont("helvetica", "bold")
        pdf.text("SERENO", pageWidth / 2, margin + 25, { align: "center" })

        pdf.setFontSize(14)
        pdf.setFont("helvetica", "normal")
        pdf.text("User Experience Research Report", pageWidth / 2, margin + 45, { align: "center" })

        // Study details
        setTextColor(colors.darkGray)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Concept Testing Results & Analysis", pageWidth / 2, margin + 100, { align: "center" })

        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

        pdf.setFontSize(12)
        pdf.setFont("helvetica", "normal")
        pdf.text(`Study Period: ${currentDate}`, pageWidth / 2, margin + 130, { align: "center" })
        pdf.text(`Total Participants: ${results.length}`, pageWidth / 2, margin + 150, { align: "center" })

        // Footer
        setTextColor(colors.mediumGray)
        pdf.setFontSize(10)
        pdf.text("Confidential Research Document", pageWidth / 2, pageHeight - margin, { align: "center" })

        // PAGE 2: EXECUTIVE SUMMARY
        addPage()

        let yPos = margin + 20

        // Header
        addRect(margin, margin, pageWidth - 2 * margin, 20, colors.darkGray)
        setTextColor(colors.white)
        pdf.setFontSize(18)
        pdf.setFont("helvetica", "bold")
        pdf.text("Executive Summary", margin + 10, margin + 14)

        yPos = margin + 40

        // Key metrics section
        setTextColor(colors.black)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Metrics", margin, yPos)
        yPos += 20

        // Filter valid responses
        const validResponses = results.filter((r) => r.responses && Object.keys(r.responses).length > 5)

        // Metrics in a clean table format
        const metrics = [
            { label: "Total Participants", value: results.length.toString() },
            { label: "Complete Responses", value: validResponses.length.toString() },
            { label: "Completion Rate", value: "100%" },
            {
                label: "Would Use Again (Yes)",
                value:
                    validResponses.length > 0
                        ? `${Math.round((validResponses.filter((r) => r.responses?.wouldUseAgain === "Yes").length / validResponses.length) * 100)}%`
                        : "0%",
            },
            {
                label: "Easy Interface",
                value:
                    validResponses.length > 0
                        ? `${Math.round((validResponses.filter((r) => r.responses?.interfaceEase === "Yes").length / validResponses.length) * 100)}%`
                        : "0%",
            },
        ]

        metrics.forEach((metric) => {
            addRect(margin, yPos, pageWidth - 2 * margin, 15, colors.lightGray)

            setTextColor(colors.black)
            pdf.setFontSize(11)
            pdf.setFont("helvetica", "bold")
            pdf.text(metric.label, margin + 5, yPos + 10)

            pdf.setFont("helvetica", "normal")
            pdf.text(metric.value, pageWidth - margin - 30, yPos + 10)

            yPos += 20
        })

        yPos += 20

        // Key findings
        setTextColor(colors.black)
        pdf.setFontSize(16)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Findings", margin, yPos)
        yPos += 20

        if (validResponses.length > 0) {
            const findings = [
                `${Math.round((validResponses.filter((r) => r.responses?.findSession === "Yes").length / validResponses.length) * 100)}% found it easy to start breathing sessions`,
                `${Math.round((validResponses.filter((r) => r.responses?.voiceGuidance === "Very clear").length / validResponses.length) * 100)}% rated voice guidance as very clear`,
                `${Math.round((validResponses.filter((r) => r.responses?.audioPlayer === "Easy and clear").length / validResponses.length) * 100)}% found the audio player easy to use`,
                `${Math.round((validResponses.filter((r) => r.responses?.wouldUseAgain === "Yes").length / validResponses.length) * 100)}% would use Sereno again for wellness activities`,
            ]

            pdf.setFontSize(11)
            pdf.setFont("helvetica", "normal")
            setTextColor(colors.darkGray)

            findings.forEach((finding) => {
                pdf.text(`• ${finding}`, margin + 5, yPos)
                yPos += 15
            })
        } else {
            setTextColor(colors.mediumGray)
            pdf.setFontSize(11)
            pdf.text("No complete test responses available for analysis.", margin + 5, yPos)
        }

        // PAGE 3+: DETAILED RESULTS
        results.forEach((result, resultIndex) => {
            addPage()
            yPos = margin + 20

            // Header
            addRect(margin, margin, pageWidth - 2 * margin, 20, colors.darkGray)
            setTextColor(colors.white)
            pdf.setFontSize(16)
            pdf.setFont("helvetica", "bold")
            pdf.text(`Participant ${resultIndex + 1}: ${result.user_data.name}`, margin + 10, margin + 14)

            yPos = margin + 40

            // Participant info
            setTextColor(colors.black)
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "bold")
            pdf.text("Participant Information", margin, yPos)
            yPos += 15

            const userInfo = [
                { label: "Name", value: result.user_data.name },
                { label: "Age", value: result.user_data.age.toString() },
                { label: "Location", value: result.user_data.location },
                { label: "Profession", value: result.user_data.profession },
                { label: "Drives", value: result.user_data.drives ? "Yes" : "No" },
                { label: "Car", value: result.user_data.car || "N/A" },
            ]

            userInfo.forEach((info) => {
                setTextColor(colors.darkGray)
                pdf.setFontSize(10)
                pdf.setFont("helvetica", "bold")
                pdf.text(`${info.label}:`, margin + 5, yPos)
                pdf.setFont("helvetica", "normal")
                pdf.text(info.value, margin + 50, yPos)
                yPos += 12
            })

            yPos += 15

            // Test responses
            setTextColor(colors.black)
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "bold")
            pdf.text("Test Responses", margin, yPos)
            yPos += 15

            const responses = [
                { label: "Wellness Frequency", value: result.responses?.wellnessFrequency || "N/A" },
                { label: "Easy to Find Session", value: result.responses?.findSession || "N/A" },
                { label: "Voice Guidance", value: result.responses?.voiceGuidance || "N/A" },
                { label: "Audio Player", value: result.responses?.audioPlayer || "N/A" },
                { label: "Break Choice", value: result.responses?.breakChoice || "N/A" },
                { label: "Language Preference", value: result.responses?.languagePreference || "N/A" },
                { label: "Music Preference", value: result.responses?.musicPreference || "N/A" },
                { label: "Interface Ease", value: result.responses?.interfaceEase || "N/A" },
                { label: "Confusing", value: result.responses?.confusing || "N/A" },
                { label: "Would Use Again", value: result.responses?.wouldUseAgain || "N/A" },
            ]

            responses.forEach((response) => {
                if (yPos > pageHeight - 40) {
                    addPage()
                    yPos = margin + 20
                }

                setTextColor(colors.darkGray)
                pdf.setFontSize(10)
                pdf.setFont("helvetica", "bold")
                pdf.text(`${response.label}:`, margin + 5, yPos)
                pdf.setFont("helvetica", "normal")
                pdf.text(response.value, margin + 70, yPos)
                yPos += 12
            })

            // Suggestions
            if (result.responses?.suggestions) {
                yPos += 10
                setTextColor(colors.black)
                pdf.setFontSize(12)
                pdf.setFont("helvetica", "bold")
                pdf.text("Suggestions:", margin + 5, yPos)
                yPos += 10

                setTextColor(colors.darkGray)
                pdf.setFontSize(10)
                pdf.setFont("helvetica", "normal")
                const suggestionLines = pdf.splitTextToSize(result.responses.suggestions, pageWidth - 2 * margin - 10)
                pdf.text(suggestionLines, margin + 5, yPos)
            }

            // Why use again
            if (result.responses?.whyUseAgain) {
                yPos += 20
                setTextColor(colors.black)
                pdf.setFontSize(12)
                pdf.setFont("helvetica", "bold")
                pdf.text("Why Use Again:", margin + 5, yPos)
                yPos += 10

                setTextColor(colors.darkGray)
                pdf.setFontSize(10)
                pdf.setFont("helvetica", "normal")
                const whyLines = pdf.splitTextToSize(result.responses.whyUseAgain, pageWidth - 2 * margin - 10)
                pdf.text(whyLines, margin + 5, yPos)
            }
        })

        // Save the PDF
        const fileName = `sereno-user-research-report-${new Date().toISOString().split("T")[0]}.pdf`
        pdf.save(fileName)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading test results...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Test Results Dashboard</h1>
                        <p className="text-gray-400">Sereno PWA User Experience Research</p>
                    </div>
                    <button
                        onClick={generateBeautifulPDF}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white rounded-lg transition-all duration-200 border border-gray-600 shadow-lg"
                    >
                        <Download size={20} />
                        Export PDF Report
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="text-blue-400" size={24} />
                            <h3 className="text-lg font-semibold">Total Participants</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="text-green-400" size={24} />
                            <h3 className="text-lg font-semibold">This Week</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats.thisWeek}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 className="text-purple-400" size={24} />
                            <h3 className="text-lg font-semibold">Completion Rate</h3>
                        </div>
                        <p className="text-3xl font-bold">{stats.completionRate}%</p>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-semibold">Recent Test Results</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-700">
                            <tr>
                                <th className="text-left p-4">Participant</th>
                                <th className="text-left p-4">Age</th>
                                <th className="text-left p-4">Location</th>
                                <th className="text-left p-4">Drives</th>
                                <th className="text-left p-4">Would Use Again</th>
                                <th className="text-left p-4">Date</th>
                                <th className="text-left p-4">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {results.map((result) => (
                                <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-750">
                                    <td className="p-4 font-medium">{result.user_data.name}</td>
                                    <td className="p-4">{result.user_data.age}</td>
                                    <td className="p-4">{result.user_data.location}</td>
                                    <td className="p-4">
                      <span
                          className={`px-2 py-1 rounded text-xs ${
                              result.user_data.drives ? "bg-green-900 text-green-300" : "bg-gray-600 text-gray-300"
                          }`}
                      >
                        {result.user_data.drives ? "Yes" : "No"}
                      </span>
                                    </td>
                                    <td className="p-4">
                      <span
                          className={`px-2 py-1 rounded text-xs ${
                              result.responses?.wouldUseAgain === "Yes"
                                  ? "bg-green-900 text-green-300"
                                  : result.responses?.wouldUseAgain === "Maybe"
                                      ? "bg-yellow-900 text-yellow-300"
                                      : result.responses?.wouldUseAgain === "No"
                                          ? "bg-red-900 text-red-300"
                                          : "bg-gray-600 text-gray-300"
                          }`}
                      >
                        {result.responses?.wouldUseAgain || "N/A"}
                      </span>
                                    </td>
                                    <td className="p-4 text-gray-400">{new Date(result.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => setSelectedResult(result)}
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                                        >
                                            <Eye size={14} />
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Detailed View Modal */}
                {selectedResult && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Test Result Details</h3>
                                <button onClick={() => setSelectedResult(null)} className="text-gray-400 hover:text-white">
                                    ✕
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* User Data */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Participant Information</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <strong>Name:</strong> {selectedResult.user_data.name}
                                        </div>
                                        <div>
                                            <strong>Age:</strong> {selectedResult.user_data.age}
                                        </div>
                                        <div>
                                            <strong>Location:</strong> {selectedResult.user_data.location}
                                        </div>
                                        <div>
                                            <strong>Profession:</strong> {selectedResult.user_data.profession}
                                        </div>
                                        <div>
                                            <strong>Drives:</strong> {selectedResult.user_data.drives ? "Yes" : "No"}
                                        </div>
                                        <div>
                                            <strong>Car:</strong> {selectedResult.user_data.car || "N/A"}
                                        </div>
                                    </div>
                                </div>

                                {/* Responses */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-3">Test Responses</h4>
                                    <div className="space-y-3 text-sm">
                                        <div>
                                            <strong>Wellness Frequency:</strong> {selectedResult.responses?.wellnessFrequency || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Find Session:</strong> {selectedResult.responses?.findSession || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Voice Guidance:</strong> {selectedResult.responses?.voiceGuidance || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Audio Player:</strong> {selectedResult.responses?.audioPlayer || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Break Choice:</strong> {selectedResult.responses?.breakChoice || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Language Preference:</strong> {selectedResult.responses?.languagePreference || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Music Preference:</strong> {selectedResult.responses?.musicPreference || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Interface Ease:</strong> {selectedResult.responses?.interfaceEase || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Confusing:</strong> {selectedResult.responses?.confusing || "N/A"}
                                        </div>
                                        {selectedResult.responses?.suggestions && (
                                            <div>
                                                <strong>Suggestions:</strong> {selectedResult.responses.suggestions}
                                            </div>
                                        )}
                                        <div>
                                            <strong>Would Use Again:</strong> {selectedResult.responses?.wouldUseAgain || "N/A"}
                                        </div>
                                        {selectedResult.responses?.whyUseAgain && (
                                            <div>
                                                <strong>Why Use Again:</strong> {selectedResult.responses.whyUseAgain}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
