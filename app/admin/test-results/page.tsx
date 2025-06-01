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

        void loadResults() // Use void operator to explicitly ignore the Promise
    }, [])

    const fetchResults = async () => {
        try {
            console.log("=== Fetching test results ===")

            const response = await fetch("/api/test-results")
            console.log("Fetch response status:", response.status)

            const data = await response.json()
            console.log("Fetched data:", data)

            if (!response.ok) {
                console.error("Fetch error:", data)
                alert(`Error fetching results: ${data.error || "Unknown error"}`)
                return
            }

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

        const pdf = new jsPDF("l", "mm", "a4") // Landscape orientation
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        // Monochromatic color palette
        const colors = {
            black: [0, 0, 0],
            darkGray: [40, 40, 40],
            mediumGray: [120, 120, 120],
            lightGray: [200, 200, 200],
            white: [255, 255, 255],
        }

        const setColor = (colorArray: number[]) => {
            pdf.setFillColor(colorArray[0], colorArray[1], colorArray[2])
        }

        const setTextColor = (colorArray: number[]) => {
            pdf.setTextColor(colorArray[0], colorArray[1], colorArray[2])
        }

        const addColoredRect = (x: number, y: number, width: number, height: number, colorArray: number[]) => {
            setColor(colorArray)
            pdf.rect(x, y, width, height, "F")
        }

        const addPage = () => {
            pdf.addPage("l")
            // Add subtle background pattern
            addColoredRect(0, 0, pageWidth, pageHeight, colors.white)

            // Add geometric pattern in background
            setColor(colors.lightGray)
            for (let i = 0; i < pageWidth; i += 20) {
                pdf.setLineWidth(0.1)
                pdf.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2])
                pdf.line(i, 0, i, pageHeight)
            }
        }

        // PAGE 1: COVER PAGE
        addColoredRect(0, 0, pageWidth, pageHeight, colors.white)

        // Header stripe
        addColoredRect(0, 0, pageWidth, 40, colors.black)

        // Main title area
        addColoredRect(0, 40, pageWidth, 120, colors.white)

        // Accent stripe
        addColoredRect(0, 160, pageWidth, 8, colors.darkGray)

        // Content area
        addColoredRect(0, 168, pageWidth, pageHeight - 168, colors.white)

        // Title
        setTextColor(colors.white)
        pdf.setFontSize(48)
        pdf.setFont("helvetica", "bold")
        pdf.text("SERENO", pageWidth / 2, 28, { align: "center" })

        setTextColor(colors.black)
        pdf.setFontSize(32)
        pdf.setFont("helvetica", "normal")
        pdf.text("User Experience Research Report", pageWidth / 2, 90, { align: "center" })

        pdf.setFontSize(18)
        setTextColor(colors.mediumGray)
        pdf.text("Concept Testing Results & Analysis", pageWidth / 2, 110, { align: "center" })

        // Study details
        setTextColor(colors.darkGray)
        pdf.setFontSize(14)
        const currentDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        pdf.text(`Study Period: ${currentDate}`, pageWidth / 2, 140, { align: "center" })
        pdf.text(`Total Participants: ${results.length}`, pageWidth / 2, 155, { align: "center" })

        // Bottom section with geometric elements
        setColor(colors.lightGray)
        pdf.circle(50, pageHeight - 50, 20, "F")
        pdf.circle(pageWidth - 50, pageHeight - 50, 15, "F")

        setTextColor(colors.mediumGray)
        pdf.setFontSize(12)
        pdf.text("Confidential Research Document", pageWidth / 2, pageHeight - 20, { align: "center" })

        // PAGE 2: EXECUTIVE SUMMARY
        addPage()

        // Header
        addColoredRect(0, 0, pageWidth, 30, colors.darkGray)
        setTextColor(colors.white)
        pdf.setFontSize(24)
        pdf.setFont("helvetica", "bold")
        pdf.text("Executive Summary", 40, 20)

        let yPos = 60

        // Key metrics section
        setTextColor(colors.black)
        pdf.setFontSize(18)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Metrics", 40, yPos)
        yPos += 20

        // Metrics boxes
        const metrics = [
            { label: "Total Participants", value: results.length.toString() },
            { label: "Completion Rate", value: "100%" },
            {
                label: "Would Use Again",
                value:
                    results.length > 0
                        ? `${Math.round((results.filter((r) => r.responses?.wouldUseAgain === "Yes").length / results.length) * 100)}%`
                        : "0%",
            },
            {
                label: "Easy to Use",
                value:
                    results.length > 0
                        ? `${Math.round((results.filter((r) => r.responses?.interfaceEase === "Yes").length / results.length) * 100)}%`
                        : "0%",
            },
        ]

        metrics.forEach((metric, metricIndex) => {
            const x = 40 + metricIndex * 160
            addColoredRect(x, yPos, 140, 50, colors.lightGray)
            addColoredRect(x, yPos, 140, 20, colors.darkGray)

            setTextColor(colors.white)
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "bold")
            pdf.text(metric.label, x + 70, yPos + 14, { align: "center" })

            setTextColor(colors.black)
            pdf.setFontSize(24)
            pdf.setFont("helvetica", "bold")
            pdf.text(metric.value, x + 70, yPos + 40, { align: "center" })
        })

        yPos += 80

        // Key findings
        setTextColor(colors.black)
        pdf.setFontSize(18)
        pdf.setFont("helvetica", "bold")
        pdf.text("Key Findings", 40, yPos)
        yPos += 20

        const findings = [
            `${results.length > 0 ? Math.round((results.filter((r) => r.responses?.findSession === "Yes").length / results.length) * 100) : 0}% found it easy to start breathing sessions`,
            `${results.length > 0 ? Math.round((results.filter((r) => r.responses?.voiceGuidance === "Very clear").length / results.length) * 100) : 0}% rated voice guidance as very clear`,
            `${results.length > 0 ? Math.round((results.filter((r) => r.responses?.audioPlayer === "Easy and clear").length / results.length) * 100) : 0}% found the audio player easy to use`,
            `${results.length > 0 ? Math.round((results.filter((r) => r.responses?.wouldUseAgain === "Yes").length / results.length) * 100) : 0}% would use Sereno again for wellness activities`,
        ]

        pdf.setFontSize(12)
        pdf.setFont("helvetica", "normal")
        setTextColor(colors.darkGray)

        findings.forEach((finding) => {
            // Bullet point
            setColor(colors.darkGray)
            pdf.circle(45, yPos + 5, 2, "F")

            pdf.text(finding, 55, yPos + 8)
            yPos += 15
        })

        // PAGE 3: DETAILED RESULTS
        addPage()

        // Header
        addColoredRect(0, 0, pageWidth, 30, colors.darkGray)
        setTextColor(colors.white)
        pdf.setFontSize(24)
        pdf.setFont("helvetica", "bold")
        pdf.text("Detailed Participant Results", 40, 20)

        yPos = 60

        results.forEach((result, resultIndex) => {
            if (yPos > pageHeight - 80) {
                addPage()
                yPos = 60
            }

            // Participant header
            addColoredRect(40, yPos - 5, pageWidth - 80, 25, colors.lightGray)
            setTextColor(colors.black)
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "bold")
            pdf.text(`Participant ${resultIndex + 1}: ${result.user_data.name}`, 50, yPos + 8)

            setTextColor(colors.mediumGray)
            pdf.setFontSize(10)
            pdf.text(
                `${result.user_data.age} years old • ${result.user_data.location} • ${result.user_data.profession}`,
                50,
                yPos + 18,
            )

            yPos += 35

            // Key responses in columns
            const responses = [
                { label: "Wellness Frequency", value: result.responses?.wellnessFrequency || "N/A" },
                { label: "Easy to Find Session", value: result.responses?.findSession || "N/A" },
                { label: "Voice Guidance", value: result.responses?.voiceGuidance || "N/A" },
                { label: "Audio Player", value: result.responses?.audioPlayer || "N/A" },
                { label: "Would Use Again", value: result.responses?.wouldUseAgain || "N/A" },
            ]

            setTextColor(colors.darkGray)
            pdf.setFontSize(10)
            pdf.setFont("helvetica", "normal")

            responses.forEach((response, respIndex) => {
                const x = 50 + (respIndex % 2) * 300
                const y = yPos + Math.floor(respIndex / 2) * 12

                pdf.setFont("helvetica", "bold")
                pdf.text(`${response.label}:`, x, y)
                pdf.setFont("helvetica", "normal")
                pdf.text(response.value, x + 80, y)
            })

            yPos += 40

            // Suggestions if any
            if (result.responses?.suggestions) {
                setTextColor(colors.black)
                pdf.setFontSize(10)
                pdf.setFont("helvetica", "bold")
                pdf.text("Suggestions:", 50, yPos)

                setTextColor(colors.darkGray)
                pdf.setFont("helvetica", "normal")
                const suggestionLines = pdf.splitTextToSize(result.responses.suggestions, pageWidth - 120)
                pdf.text(suggestionLines, 50, yPos + 10)
                yPos += 10 + suggestionLines.length * 4
            }

            yPos += 20
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
                        Export Beautiful PDF Report
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
                              result.responses.wouldUseAgain === "Yes"
                                  ? "bg-green-900 text-green-300"
                                  : result.responses.wouldUseAgain === "Maybe"
                                      ? "bg-yellow-900 text-yellow-300"
                                      : "bg-red-900 text-red-300"
                          }`}
                      >
                        {result.responses.wouldUseAgain}
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
                                            <strong>Wellness Frequency:</strong> {selectedResult.responses.wellnessFrequency}
                                        </div>
                                        <div>
                                            <strong>Find Session:</strong> {selectedResult.responses.findSession}
                                        </div>
                                        <div>
                                            <strong>Voice Guidance:</strong> {selectedResult.responses.voiceGuidance}
                                        </div>
                                        <div>
                                            <strong>Audio Player:</strong> {selectedResult.responses.audioPlayer}
                                        </div>
                                        <div>
                                            <strong>Break Choice:</strong> {selectedResult.responses.breakChoice}
                                        </div>
                                        <div>
                                            <strong>Language Preference:</strong> {selectedResult.responses.languagePreference}
                                        </div>
                                        <div>
                                            <strong>Music Preference:</strong> {selectedResult.responses.musicPreference}
                                        </div>
                                        <div>
                                            <strong>Interface Ease:</strong> {selectedResult.responses.interfaceEase}
                                        </div>
                                        <div>
                                            <strong>Confusing:</strong> {selectedResult.responses.confusing}
                                        </div>
                                        {selectedResult.responses.suggestions && (
                                            <div>
                                                <strong>Suggestions:</strong> {selectedResult.responses.suggestions}
                                            </div>
                                        )}
                                        <div>
                                            <strong>Would Use Again:</strong> {selectedResult.responses.wouldUseAgain}
                                        </div>
                                        {selectedResult.responses.whyUseAgain && (
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
