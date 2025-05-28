/**
 * components/ui/rct-lab-dashboard.tsx
 * RCT Lab dashboard with proper PDF generation with styling and colors.
 */
"use client"

import { useState } from "react"
import {
    Download,
    Plus,
    Users,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Calendar,
    Zap,
    Bug,
    TrendingUp,
    FileText,
    BarChart3,
    Target,
    Settings,
} from "lucide-react"

// Add jsPDF type declaration - Fixed type compatibility
declare module "jspdf" {
    interface jsPDF {
        internal: {
            events: import("jspdf").PubSub
            scaleFactor: number
            pageSize: {
                width: number
                getWidth(): number
                height: number
                getHeight(): number
            }
            pages: number[]
            getEncryptor(objectId: number): (data: string) => string
        }
        setFillColor(color: string): void
        setFillColor(r: number, g: number, b: number): void
        rect(x: number, y: number, width: number, height: number, style?: string): void
        setTextColor(r: number, g: number, b: number): void
        setFontSize(size: number): void
        setFont(fontName: string, fontStyle: string): void
        text(text: string, x: number, y: number, options?: { align?: string }): void
        setDrawColor(r: number, g: number, b: number): void
        line(x1: number, y1: number, x2: number, y2: number): void
        addPage(): void
        splitTextToSize(text: string, maxWidth: number): string[]
        save(filename: string): void
        circle(x: number, y: number, radius: number, style?: string): void
        setLineWidth(width: number): void
        roundedRect(
            x: number,
            y: number,
            width: number,
            height: number,
            cornerRadiusX: number,
            cornerRadiusY: number,
            style?: string,
        ): void
        moveTo(x: number, y: number): void
    }
}

interface TestResult {
    feature: string
    alex: "success" | "warning" | "error"
    emma: "success" | "warning" | "error"
    malcolm: "success" | "warning" | "error"
    fabrice: "success" | "warning" | "error"
    maristella: "success" | "warning" | "error"
}

interface UserPersona {
    id: string
    name: string
    age: number
    location: string
    car: string
    techComfort: string
    goals: string
    context: string
    overallScore: number
    description: string
}

interface AppIssue {
    id: number
    title: string
    severity: "high" | "medium" | "low"
    reportedBy: string[]
    description: string
    status: "open" | "in-progress" | "resolved"
}

interface TestSubmission {
    id: string
    testType: "ab" | "usability" | "preference"
    userData: {
        name: string
        age: number
        location: string
        profession: string
        car: string
        techComfort: number
    }
    responses: Record<string, any>
    timestamp: Date
}

// Updated effectiveness matrix with detailed user suggestions
const effectivenessMatrix = [
    {
        user: "Alex",
        focusImprovement: "4.5/5",
        relaxationEffect: "4.8/5",
        subjectiveSatisfaction: "4.8/5",
        comments: "Quick sessions while charging my EV help me refocus efficiently.",
        suggestions: "Integrate with car's charging status, Voice commands for hands-free operation",
    },
    {
        user: "Emma",
        focusImprovement: "4.7/5",
        relaxationEffect: "5.0/5",
        subjectiveSatisfaction: "4.9/5",
        comments: "I use the app purely for breathing and meditation, no driving needed.",
        suggestions:
            "More meditation variety: Pranayama (Interrupted Breath), Box Breath Variations (4-7-8 or 5-5-5 patterns), Fire Breath (Kapalabhati) for energy and mind clarity",
    },
    {
        user: "Malcolm",
        focusImprovement: "4.4/5",
        relaxationEffect: "4.6/5",
        subjectiveSatisfaction: "4.6/5",
        comments: "Great way to recharge mentally during long trips.",
        suggestions: "Offline mode for remote areas, binaural beats for enhanced relaxation during long drives",
    },
    {
        user: "Fabrice",
        focusImprovement: "4.0/5",
        relaxationEffect: "4.3/5",
        subjectiveSatisfaction: "4.2/5",
        comments: "Simple exercises sharpen my focus effectively before driving.",
        suggestions:
            "Customizable breathing patterns with different lengths, rhythms, and pauses. Simple one-tap session start for quick access",
    },
    {
        user: "Maristella",
        focusImprovement: "4.3/5",
        relaxationEffect: "4.6/5",
        subjectiveSatisfaction: "4.7/5",
        comments: "Helps me stay calm and focused during my daily EV commute.",
        suggestions: "More ambient sounds to improve focus while driving, nature sounds and white noise options",
    },
]

export function RCTLabDashboard() {
    const [showNewTestModal, setShowNewTestModal] = useState(false)
    const [selectedTestType, setSelectedTestType] = useState<"ab" | "usability" | "preference" | "">("")
    const [currentStep, setCurrentStep] = useState(1)
    const [showIssues, setShowIssues] = useState(false)
    const [showEffectivenessMatrix, setShowEffectivenessMatrix] = useState(false)
    const [testSubmissions, setTestSubmissions] = useState<TestSubmission[]>([])

    // User form data
    const [userData, setUserData] = useState({
        name: "",
        age: 0,
        location: "",
        profession: "",
        car: "",
        techComfort: 3,
    })

    // Test responses
    const [testResponses, setTestResponses] = useState<Record<string, any>>({})

    // Updated user personas with new names and descriptions
    const userPersonas: UserPersona[] = [
        {
            id: "alex",
            name: "Alex",
            age: 35,
            location: "Knokke",
            car: "Porsche Macan EV",
            techComfort: "High",
            goals: "Quick focused breathing",
            context: "Before driving, charging",
            overallScore: 4.8,
            description: "Busy executive seeking quick, focused breathing sessions before driving and during charging breaks",
        },
        {
            id: "emma",
            name: "Emma",
            age: 29,
            location: "Ghent",
            car: "Non-driver",
            techComfort: "Moderate",
            goals: "Longer guided meditations",
            context: "Relaxation, as passenger",
            overallScore: 4.9,
            description: "Yoga enthusiast who doesn't drive but enjoys longer guided meditations for relaxation",
        },
        {
            id: "malcolm",
            name: "Malcolm",
            age: 40,
            location: "Antwerp",
            car: "Porsche Taycan",
            techComfort: "High",
            goals: "Vitalize during trips",
            context: "Long trips, while parked",
            overallScore: 4.6,
            description: "Porsche Taycan driver who uses the app to vitalize during long trips and unwind while parked",
        },
        {
            id: "fabrice",
            name: "Fabrice",
            age: 42,
            location: "Knokke",
            car: "Mercedes Driver",
            techComfort: "Moderate",
            goals: "Short mindfulness routines",
            context: "Before/after driving",
            overallScore: 4.2,
            description: "Mercedes driver who prefers quick mindfulness routines to sharpen focus before driving",
        },
        {
            id: "maristella",
            name: "Maristella",
            age: 22,
            location: "Leuven",
            car: "EV Commuter",
            techComfort: "High",
            goals: "Customizable sessions",
            context: "Studies, daily commute",
            overallScore: 4.7,
            description: "Health-conscious student who combines mindful breathing with studies and daily EV commute",
        },
    ]

    // Test results with updated user names
    const testResults: TestResult[] = [
        {
            feature: "Button Functionality",
            alex: "success",
            emma: "success",
            malcolm: "success",
            fabrice: "warning",
            maristella: "success",
        },
        {
            feature: "Glanceability",
            alex: "success",
            emma: "success",
            malcolm: "warning",
            fabrice: "error",
            maristella: "success",
        },
        {
            feature: "Audio Player",
            alex: "success",
            emma: "warning",
            malcolm: "success",
            fabrice: "success",
            maristella: "warning",
        },
        {
            feature: "Color Themes",
            alex: "success",
            emma: "success",
            malcolm: "success",
            fabrice: "warning",
            maristella: "error",
        },
        {
            feature: "Breathing Flow",
            alex: "success",
            emma: "success",
            malcolm: "success",
            fabrice: "success",
            maristella: "success",
        },
    ]

    // 21 realistic app issues based on user feedback - updated with simple user terms
    const appIssues: AppIssue[] = [
        {
            id: 1,
            title: "Audio keeps playing after I close the app",
            severity: "high",
            reportedBy: ["Emma", "Fabrice", "Alex"],
            description: "Background music doesn't stop when closing browser tab or app",
            status: "open",
        },
        {
            id: 2,
            title: "Can't see the pause button clearly",
            severity: "medium",
            reportedBy: ["Malcolm", "Fabrice"],
            description: "Play/pause controls are too faint and hard to spot",
            status: "in-progress",
        },
        {
            id: 3,
            title: "Need more color themes - only dark theme available",
            severity: "low",
            reportedBy: ["Emma", "Maristella", "Alex"],
            description: "Users want light theme and other color options beyond just dark mode",
            status: "open",
        },
        {
            id: 4,
            title: "Meditation sessions have no voice guidance",
            severity: "medium",
            reportedBy: ["Emma", "Fabrice"],
            description: "Only background music plays, no spoken instructions during meditation",
            status: "open",
        },
        {
            id: 5,
            title: "App doesn't fit properly on my phone screen",
            severity: "high",
            reportedBy: ["Maristella", "Emma"],
            description: "Content gets cut off on mobile devices, need to scroll to see everything",
            status: "in-progress",
        },
        {
            id: 6,
            title: "Volume slider is too sensitive",
            severity: "medium",
            reportedBy: ["Malcolm", "Fabrice"],
            description: "Small finger movements cause big volume jumps, hard to set precise level",
            status: "open",
        },
        {
            id: 7,
            title: "No way to skip to different parts of meditation",
            severity: "low",
            reportedBy: ["Alex", "Emma"],
            description: "Can't fast forward or rewind within a session",
            status: "open",
        },
        {
            id: 8,
            title: "App crashes when I get a phone call",
            severity: "high",
            reportedBy: ["Maristella", "Malcolm"],
            description: "Session stops and doesn't resume after call ends",
            status: "open",
        },
        {
            id: 9,
            title: "Timer countdown is too small to read while driving",
            severity: "high",
            reportedBy: ["Alex", "Malcolm", "Fabrice"],
            description: "Numbers are tiny and hard to see from driver's seat",
            status: "in-progress",
        },
        {
            id: 10,
            title: "No way to save favorite sessions",
            severity: "medium",
            reportedBy: ["Emma", "Maristella"],
            description: "Have to scroll through all options every time to find preferred meditation",
            status: "open",
        },
        {
            id: 11,
            title: "Couldn't sign in",
            severity: "high",
            reportedBy: ["Alex", "Fabrice"],
            description: "Login button doesn't work, stuck on loading screen",
            status: "in-progress",
        },
        {
            id: 12,
            title: "Timer buttons too small for quick selection while driving",
            severity: "high",
            reportedBy: ["Fabrice", "Malcolm"],
            description: "Difficulty selecting timer options quickly before driving, need larger touch targets",
            status: "open",
        },
        {
            id: 13,
            title: "Theme switching causes brief app freeze",
            severity: "medium",
            reportedBy: ["Maristella"],
            description: "App freezes for 1-2 seconds when switching between color themes",
            status: "open",
        },
        {
            id: 14,
            title: "Breathing visual not visible in bright sunlight",
            severity: "medium",
            reportedBy: ["Alex", "Malcolm"],
            description: "Breathing animation too faint to see clearly during daytime charging sessions",
            status: "resolved",
        },
        {
            id: 15,
            title: "Settings panel overlaps with CarPlay interface",
            severity: "high",
            reportedBy: ["Alex", "Malcolm"],
            description: "Settings menu covers important CarPlay controls, need better positioning",
            status: "in-progress",
        },
        {
            id: 16,
            title: "Custom timer input difficult to use with gloves",
            severity: "low",
            reportedBy: ["Fabrice"],
            description: "Number input too small for winter glove use, affects cold weather usability",
            status: "open",
        },
        {
            id: 17,
            title: "Audio continues playing after session ends",
            severity: "medium",
            reportedBy: ["Emma", "Fabrice"],
            description: "Background audio doesn't stop automatically when timer reaches zero",
            status: "resolved",
        },
        {
            id: 18,
            title: "App doesn't remember last used session type",
            severity: "low",
            reportedBy: ["Alex", "Maristella"],
            description: "Always defaults to 1-minute timer instead of remembering user preference",
            status: "open",
        },
        {
            id: 19,
            title: "Breathing pace too fast for beginners",
            severity: "medium",
            reportedBy: ["Fabrice"],
            description: "Default breathing rhythm difficult to follow for meditation newcomers",
            status: "in-progress",
        },
        {
            id: 20,
            title: "No haptic feedback for session start/end",
            severity: "low",
            reportedBy: ["Malcolm", "Maristella"],
            description: "Missing vibration cues make it hard to know when session begins/ends without looking",
            status: "open",
        },
        {
            id: 21,
            title: "Audio lag when adjusting volume during session",
            severity: "medium",
            reportedBy: ["Emma", "Maristella"],
            description: "2-3 second delay when changing volume mid-session, disrupts breathing rhythm",
            status: "in-progress",
        },
    ]

    const getStatusIcon = (status: "success" | "warning" | "error") => {
        switch (status) {
            case "success":
                return <CheckCircle size={16} className="text-[#197E10]" />
            case "warning":
                return <AlertTriangle size={16} className="text-[#F3BE00]" />
            case "error":
                return <XCircle size={16} className="text-[#CC1922]" />
        }
    }

    const getStatusColor = (status: "success" | "warning" | "error") => {
        switch (status) {
            case "success":
                return "bg-[#1F3A13] border-[#197E10]/30"
            case "warning":
                return "bg-[#362B0A] border-[#F3BE00]/30"
            case "error":
                return "bg-[#330D0E] border-[#CC1922]/30"
        }
    }

    const getSeverityColor = (severity: "high" | "medium" | "low") => {
        switch (severity) {
            case "high":
                return "text-[#CC1922] bg-[#330D0E]"
            case "medium":
                return "text-[#F3BE00] bg-[#362B0A]"
            case "low":
                return "text-[#2762EC] bg-[#142D72]"
        }
    }

    const getStatusBadgeColor = (status: "open" | "in-progress" | "resolved") => {
        switch (status) {
            case "open":
                return "text-[#CC1922] bg-[#330D0E]"
            case "in-progress":
                return "text-[#F3BE00] bg-[#362B0A]"
            case "resolved":
                return "text-[#197E10] bg-[#1F3A13]"
        }
    }

    const calculateOverallSuccess = () => {
        const total = testResults.length * 5
        const successful = testResults.reduce((acc, result) => {
            return (
                acc +
                Object.values(result)
                    .slice(1)
                    .filter((status) => status === "success").length
            )
        }, 0)
        return Math.round((successful / total) * 100)
    }

    const addStatsGrid = (pdf: any, stats: any[], pageWidth: number, yPosition: number) => {
        const statsStartY = yPosition + 35
        const statWidth = (pageWidth - 70) / 2
        const statHeight = 30

        stats.forEach((stat, statIndex) => {
            const row = Math.floor(statIndex / 2)
            const col = statIndex % 2
            const statX = 40 + col * statWidth
            const statY = statsStartY + row * statHeight

            // Stat value - more prominent and elegant
            pdf.setFontSize(22)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(255, 255, 255)
            pdf.text(stat.value, statX + 15, statY)

            // Stat label - refined spacing
            pdf.setFontSize(9)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(200, 200, 200)
            pdf.text(stat.label, statX + 15, statY + 10)

            // Stat description - more elegant
            pdf.setFontSize(7)
            pdf.setTextColor(150, 150, 150)
            pdf.text(stat.desc, statX + 15, statY + 18)
        })
    }

    // Generate PDF with minimalistic Porsche design
    const generatePDF = async (reportType: string) => {
        const timestamp = new Date().toISOString().split("T")[0]

        try {
            // Import jsPDF dynamically
            const { jsPDF } = await import("jspdf")

            // Create new PDF document
            const pdf = new jsPDF("p", "mm", "a4")
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            let yPosition = 20

            // Helper function to add new page if needed
            const checkPageBreak = (requiredSpace: number) => {
                if (yPosition + requiredSpace > pageHeight - 20) {
                    pdf.addPage()
                    // Add white background for subsequent pages
                    addColoredRect(0, 0, pageWidth, pageHeight, "#FFFFFF")
                    yPosition = 20
                }
            }

            // Helper function to add colored rectangle
            const addColoredRect = (x: number, y: number, width: number, height: number, color: string) => {
                if (color.startsWith("#")) {
                    const hex = color.replace("#", "")
                    const r = Number.parseInt(hex.substring(0, 2), 16)
                    const g = Number.parseInt(hex.substring(2, 4), 16)
                    const b = Number.parseInt(hex.substring(4, 6), 16)
                    pdf.setFillColor(r, g, b)
                } else {
                    pdf.setFillColor(color)
                }
                pdf.rect(x, y, width, height, "F")
            }

            // Minimalistic Porsche color palette
            const colors = {
                black: "#000000",
                white: "#FFFFFF",
                lightGray: "#F5F5F5",
                mediumGray: "#CCCCCC",
                darkGray: "#333333",
                porscheRed: "#e41300", // Only one red element per page
            }

            // FIRST PAGE - Black background with minimal design
            addColoredRect(0, 0, pageWidth, pageHeight, colors.black)

            // Minimal border - thin white line
            pdf.setDrawColor(255, 255, 255)
            pdf.setLineWidth(0.2)
            pdf.rect(15, 15, pageWidth - 30, pageHeight - 30)

            // Enhanced first page content - More compact design
            yPosition = 40

            // Main Sereno Logo - Single, prominent placement
            pdf.setTextColor(255, 255, 255)
            pdf.setFontSize(38)
            pdf.setFont("helvetica", "normal")
            pdf.text("SERENO", pageWidth / 2, yPosition, { align: "center" })

            yPosition += 20

            // Subtitle - In-Car Mindfulness RCT
            pdf.setTextColor(200, 200, 200)
            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")
            pdf.text("In-Car Mindfulness RCT", pageWidth / 2, yPosition, { align: "center" })

            yPosition += 10

            // Full title - Randomised Controlled Trial
            pdf.setTextColor(180, 180, 180)
            pdf.setFontSize(9)
            pdf.setFont("helvetica", "normal")
            pdf.text("(Randomised Controlled Trial) UX Research", pageWidth / 2, yPosition, { align: "center" })

            yPosition += 18

            // Elegant divider with refined dots
            pdf.setFillColor(120, 120, 120)
            for (let i = 0; i < 9; i++) {
                pdf.circle(pageWidth / 2 - 40 + i * 10, yPosition, 0.8, "F")
            }

            yPosition += 15

            // Research description - Professional and detailed
            pdf.setFontSize(10)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(190, 190, 190)
            const researchDesc =
                "Controlled user testing with five diverse personas evaluating usability, effectiveness, and user experience of our in-car breathing and meditation PWA across multiple driving scenarios."
            const splitResearchDesc = pdf.splitTextToSize(researchDesc, pageWidth - 70)
            pdf.text(splitResearchDesc, pageWidth / 2, yPosition, { align: "center" })

            yPosition += 25

            // RESEARCH OVERVIEW - Enhanced table design (more compact)
            pdf.setDrawColor(80, 80, 80)
            pdf.setLineWidth(0.1)
            pdf.rect(30, yPosition, pageWidth - 60, 85)

            // Table header with background
            pdf.setFillColor(40, 40, 40)
            pdf.rect(30, yPosition, pageWidth - 60, 18, "F")

            pdf.setFontSize(12)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(255, 255, 255)
            pdf.text("RESEARCH OVERVIEW", pageWidth / 2, yPosition + 11, { align: "center" })

            // Table content area
            yPosition += 22

            // Enhanced stats layout in a professional 2x2 grid (more compact)
            const stats = [
                { label: "PARTICIPANTS", value: "5", desc: "Diverse personas" },
                {
                    label: "SUCCESS RATE",
                    value: `${calculateOverallSuccess()}%`,
                    desc: "Feature performance",
                },
                { label: "TEST SESSIONS", value: "25+", desc: "RCT evaluations" },
                {
                    label: "KEY INSIGHTS",
                    value: `${appIssues.filter((i) => i.status === "open").length}`,
                    desc: "Improvement areas",
                },
            ]

            const statsStartY = yPosition + 8
            const statWidth = (pageWidth - 80) / 2
            const statHeight = 28

            stats.forEach((stat, statIndex) => {
                const row = Math.floor(statIndex / 2)
                const col = statIndex % 2
                const statX = 40 + col * statWidth
                const statY = statsStartY + row * statHeight

                // Stat container with subtle border
                pdf.setDrawColor(100, 100, 100)
                pdf.setLineWidth(0.05)
                pdf.rect(statX, statY, statWidth - 10, statHeight - 3)

                // Stat value - prominent and elegant
                pdf.setFontSize(20)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(255, 255, 255)
                pdf.text(stat.value, statX + 12, statY + 12)

                // Stat label - refined
                pdf.setFontSize(8)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(220, 220, 220)
                pdf.text(stat.label, statX + 12, statY + 19)

                // Stat description - elegant
                pdf.setFontSize(6)
                pdf.setTextColor(170, 170, 170)
                pdf.text(stat.desc, statX + 12, statY + 24)
            })

            yPosition += 70

            // Research methodology - more professional (more compact)
            pdf.setFontSize(8)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(150, 150, 150)
            const methodology =
                "Comprehensive evaluation methodology combining quantitative metrics with qualitative user feedback to assess mindfulness application effectiveness in automotive environments."
            const splitMethodology = pdf.splitTextToSize(methodology, pageWidth - 70)
            pdf.text(splitMethodology, pageWidth / 2, yPosition, { align: "center" })

            // Elegant bottom section with more sophisticated design (fixed positioning)
            yPosition = pageHeight - 50

            // Refined geometric element - subtle line pattern
            pdf.setDrawColor(80, 80, 80)
            pdf.setLineWidth(0.1)
            pdf.line(pageWidth / 2 - 40, yPosition, pageWidth / 2 + 40, yPosition)
            pdf.line(pageWidth / 2 - 25, yPosition + 2, pageWidth / 2 + 25, yPosition + 2)
            pdf.line(pageWidth / 2 - 12, yPosition + 4, pageWidth / 2 + 12, yPosition + 4)

            yPosition += 15

            // Date and version info - more sophisticated
            pdf.setFontSize(8)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(130, 130, 130)
            pdf.text(`Report Generated: ${timestamp}`, pageWidth / 2, yPosition, { align: "center" })
            pdf.text("Version 1.0 • Research Confidential", pageWidth / 2, yPosition + 8, { align: "center" })

            // Footer - elegant and minimal
            pdf.setFontSize(7)
            pdf.setTextColor(100, 100, 100)
            pdf.text("SERENO RCT LABORATORY", pageWidth / 2, pageHeight - 12, { align: "center" })

            // SECOND PAGE - White background with minimal design
            pdf.addPage()
            addColoredRect(0, 0, pageWidth, pageHeight, colors.white)
            yPosition = 30

            // Page header - THE RED ELEMENT for page 2
            pdf.setTextColor(228, 19, 0) // Porsche red
            pdf.setFontSize(20)
            pdf.setFont("helvetica", "normal")
            pdf.text("DETAILED ANALYSIS", 20, yPosition)

            // Minimal underline
            pdf.setDrawColor(228, 19, 0)
            pdf.setLineWidth(0.2)
            pdf.line(20, yPosition + 3, 80, yPosition + 3)
            yPosition += 20

            // User Personas - minimal cards
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)
            pdf.text("1. USER PERSONAS", 20, yPosition)
            yPosition += 15

            userPersonas.forEach((persona) => {
                checkPageBreak(25)

                // Minimal persona card - just border
                pdf.setDrawColor(200, 200, 200)
                pdf.setLineWidth(0.1)
                pdf.rect(20, yPosition, pageWidth - 40, 20)

                // Persona info - clean typography
                pdf.setFontSize(11)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(0, 0, 0)
                pdf.text(`${persona.name} (${persona.age}) – ${persona.overallScore}/5`, 25, yPosition + 6)

                pdf.setFontSize(9)
                pdf.setTextColor(100, 100, 100)
                pdf.text(`${persona.location} • ${persona.car}`, 25, yPosition + 12)

                // Description - minimal
                pdf.setFontSize(8)
                pdf.setTextColor(60, 60, 60)
                const splitDescription = pdf.splitTextToSize(persona.description, pageWidth - 55)
                pdf.text(splitDescription, 25, yPosition + 17)

                yPosition += 25
            })

            // Feature Performance Matrix - minimal table
            checkPageBreak(60)
            yPosition += 10
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)
            pdf.text("2. FEATURE PERFORMANCE", 20, yPosition)
            yPosition += 15

            // Minimal table
            const rowHeight = 6
            const colWidth = (pageWidth - 40) / 7

            // Table header - minimal
            pdf.setDrawColor(150, 150, 150)
            pdf.setLineWidth(0.1)
            pdf.line(20, yPosition, pageWidth - 20, yPosition)

            pdf.setFontSize(8)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)

            const headers = ["Feature", "Alex", "Emma", "Malcolm", "Fabrice", "Maristella", "Success"]
            headers.forEach((header, headerIndex) => {
                pdf.text(header, 22 + headerIndex * colWidth, yPosition + 4)
            })
            yPosition += rowHeight

            // Table rows - minimal
            testResults.forEach((result) => {
                checkPageBreak(rowHeight)

                pdf.setFontSize(7)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(0, 0, 0)

                // Feature name
                pdf.text(result.feature, 22, yPosition + 4)

                // Status indicators - minimal dots
                const statuses = [result.alex, result.emma, result.malcolm, result.fabrice, result.maristella]
                statuses.forEach((status, statusIndex) => {
                    const x = 22 + (statusIndex + 1) * colWidth + 5

                    // Minimal colored dots
                    if (status === "success") {
                        pdf.setFillColor(100, 100, 100) // Gray for success
                    } else if (status === "warning") {
                        pdf.setFillColor(150, 150, 150) // Light gray for warning
                    } else {
                        pdf.setFillColor(50, 50, 50) // Dark gray for error
                    }
                    pdf.circle(x, yPosition + 2, 0.8, "F")
                })

                // Success rate
                const successCount = statuses.filter((s) => s === "success").length
                pdf.setTextColor(0, 0, 0)
                pdf.text(`${successCount}/5`, 22 + 6 * colWidth, yPosition + 4)

                yPosition += rowHeight
            })

            // User Feedback Effectiveness Matrix
            checkPageBreak(120)
            yPosition += 15
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)
            pdf.text("3. USER FEEDBACK EFFECTIVENESS MATRIX", 20, yPosition)
            yPosition += 15

            // Effectiveness matrix table with improved layout
            const matrixRowHeight = 12
            const matrixColWidths = [20, 18, 18, 18, 50, 60]

            // Table header
            pdf.setDrawColor(150, 150, 150)
            pdf.setLineWidth(0.1)
            pdf.line(20, yPosition, pageWidth - 20, yPosition)

            pdf.setFontSize(8)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)

            const matrixHeaders = ["User", "Focus", "Relaxation", "Satisfaction", "Comments", "Improvement Suggestions"]
            let currentX = 22
            matrixHeaders.forEach((header, headerIndex) => {
                pdf.text(header, currentX, yPosition + 5)
                currentX += matrixColWidths[headerIndex]
            })
            yPosition += 8

            // Matrix data rows
            effectivenessMatrix.forEach((row) => {
                checkPageBreak(matrixRowHeight + 5)

                pdf.setFontSize(7)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(0, 0, 0)

                currentX = 22

                // User name
                pdf.text(row.user, currentX, yPosition + 5)
                currentX += matrixColWidths[0]

                // Focus score
                pdf.text(row.focusImprovement, currentX, yPosition + 5)
                currentX += matrixColWidths[1]

                // Relaxation score
                pdf.text(row.relaxationEffect, currentX, yPosition + 5)
                currentX += matrixColWidths[2]

                // Satisfaction score
                pdf.text(row.subjectiveSatisfaction, currentX, yPosition + 5)
                currentX += matrixColWidths[3]

                // Comments - wrap text
                const splitComments = pdf.splitTextToSize(row.comments, matrixColWidths[4] - 5)
                pdf.text(splitComments, currentX, yPosition + 5)
                currentX += matrixColWidths[4]

                // Suggestions - wrap text
                const splitSuggestions = pdf.splitTextToSize(row.suggestions, matrixColWidths[5] - 5)
                pdf.text(splitSuggestions, currentX, yPosition + 5)

                yPosition += matrixRowHeight
            })

            // Update the issues section number
            checkPageBreak(40)
            yPosition += 15
            pdf.setFontSize(14)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(0, 0, 0)
            pdf.text("4. IDENTIFIED ISSUES", 20, yPosition)

            // Issues Section - minimal
            yPosition += 10

            // Issues list - minimal
            appIssues.slice(0, 6).forEach((issue, issueIndex) => {
                checkPageBreak(15)

                // Issue number
                pdf.setFontSize(9)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(0, 0, 0)
                pdf.text(`${issueIndex + 1}.`, 20, yPosition + 4)

                // Severity indicator - minimal
                let severityText = "L"
                if (issue.severity === "high") severityText = "H"
                else if (issue.severity === "medium") severityText = "M"

                pdf.setFontSize(7)
                pdf.setTextColor(100, 100, 100)
                pdf.text(`[${severityText}]`, 28, yPosition + 4)

                // Issue title - minimal
                pdf.setFontSize(9)
                pdf.setFont("helvetica", "normal")
                pdf.setTextColor(0, 0, 0)
                pdf.text(issue.title, 38, yPosition + 4)

                // Issue description - minimal
                pdf.setFontSize(7)
                pdf.setTextColor(80, 80, 80)
                const splitDesc = pdf.splitTextToSize(issue.description, pageWidth - 60)
                pdf.text(splitDesc, 38, yPosition + 8)

                yPosition += 15
            })

            // Minimal footer
            yPosition = pageHeight - 15
            pdf.setFontSize(7)
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(100, 100, 100)
            pdf.text(`Sereno RCT Lab • ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, {
                align: "center",
            })

            // Save the PDF
            pdf.save(`sereno-${reportType}-report-${timestamp}.pdf`)
        } catch (error) {
            console.error("Error generating PDF:", error)
            alert("PDF generation failed. Please try again or contact support.")
        }
    }

    const downloadPDF = async (reportType: string) => {
        try {
            await generatePDF(reportType)
        } catch (error) {
            console.error("Failed to generate PDF:", error)
            alert("Failed to generate PDF. Please try again.")
        }
    }

    const handleStartNewTest = () => {
        setShowNewTestModal(true)
        setCurrentStep(1)
        setSelectedTestType("")
        setUserData({ name: "", age: 0, location: "", profession: "", car: "", techComfort: 3 })
        setTestResponses({})
    }

    const handleTestTypeSelect = (type: "ab" | "usability" | "preference") => {
        setSelectedTestType(type)
        setCurrentStep(2)
    }

    const handleUserFormSubmit = () => {
        setCurrentStep(3)
    }

    const handleTestSubmit = () => {
        const newSubmission: TestSubmission = {
            id: Date.now().toString(),
            testType: selectedTestType as "ab" | "usability" | "preference",
            userData,
            responses: testResponses,
            timestamp: new Date(),
        }

        setTestSubmissions((prev) => [...prev, newSubmission])
        setShowNewTestModal(false)
        setCurrentStep(1)
    }

    const renderTestQuestions = () => {
        switch (selectedTestType) {
            case "ab":
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">A/B Testing Questions</h3>
                        <div>
                            <label className="block text-white font-semibold mb-2">Which timer design do you prefer?</label>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="radio"
                                        name="timer_design"
                                        value="current"
                                        onChange={(e) => setTestResponses((prev) => ({ ...prev, timer_design: e.target.value }))}
                                        className="text-white"
                                    />
                                    Current design (smaller buttons)
                                </label>
                                <label className="flex items-center gap-2 text-gray-300">
                                    <input
                                        type="radio"
                                        name="timer_design"
                                        value="new"
                                        onChange={(e) => setTestResponses((prev) => ({ ...prev, timer_design: e.target.value }))}
                                        className="text-white"
                                    />
                                    New design (larger buttons)
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Rate the color theme switching experience (1-5)
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={testResponses.theme_rating || 3}
                                onChange={(e) => setTestResponses((prev) => ({ ...prev, theme_rating: e.target.value }))}
                                className="w-full"
                            />
                            <div className="text-gray-400 text-sm">Rating: {testResponses.theme_rating || 3}/5</div>
                        </div>
                    </div>
                )
            case "usability":
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Usability Testing Tasks</h3>
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                How easy was it to start a 5-minute session?
                            </label>
                            <select
                                value={testResponses.start_session || ""}
                                onChange={(e) => setTestResponses((prev) => ({ ...prev, start_session: e.target.value }))}
                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white"
                            >
                                <option value="">Select difficulty</option>
                                <option value="very_easy">Very Easy</option>
                                <option value="easy">Easy</option>
                                <option value="moderate">Moderate</option>
                                <option value="difficult">Difficult</option>
                                <option value="very_difficult">Very Difficult</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Rate the audio controls (1-5)</label>
                            <input
                                type="range"
                                min="1"
                                max="5"
                                value={testResponses.audio_rating || 3}
                                onChange={(e) => setTestResponses((prev) => ({ ...prev, audio_rating: e.target.value }))}
                                className="w-full"
                            />
                            <div className="text-gray-400 text-sm">Rating: {testResponses.audio_rating || 3}/5</div>
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">Any usability issues encountered?</label>
                            <textarea
                                value={testResponses.usability_notes || ""}
                                onChange={(e) => setTestResponses((prev) => ({ ...prev, usability_notes: e.target.value }))}
                                placeholder="Describe any difficulties..."
                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white placeholder-gray-500 h-20"
                            />
                        </div>
                    </div>
                )
            case "preference":
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-white">Preference Testing (MaxDiff)</h3>
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Rank these features by importance (1 = most important)
                            </label>
                            <div className="space-y-2">
                                {["Quick Timer Selection", "Audio Quality", "Visual Design", "Color Themes", "Custom Durations"].map(
                                    (feature, featureIndex) => (
                                        <div key={feature} className="flex items-center gap-3">
                                            <select
                                                value={testResponses[`rank_${featureIndex}`] || ""}
                                                onChange={(e) =>
                                                    setTestResponses((prev) => ({ ...prev, [`rank_${featureIndex}`]: e.target.value }))
                                                }
                                                className="w-16 p-1 rounded bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                            >
                                                <option value="">-</option>
                                                {[1, 2, 3, 4, 5].map((num) => (
                                                    <option key={num} value={num}>
                                                        {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className="text-gray-300">{feature}</span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-white font-semibold mb-2">What's most important for in-car use?</label>
                            <div className="space-y-2">
                                {["Ease of Use", "Audio Experience", "Visual Design", "Speed"].map((attr) => (
                                    <label key={attr} className="flex items-center gap-2 text-gray-300">
                                        <input
                                            type="radio"
                                            name="most_important"
                                            value={attr}
                                            onChange={(e) => setTestResponses((prev) => ({ ...prev, most_important: e.target.value }))}
                                            className="text-white"
                                        />
                                        {attr}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full h-full bg-[#0A0A0A] flex flex-col">
            {/* Fixed Header - Reduced height */}
            <div className="flex-shrink-0 border-b border-[#2A2A2A] bg-[#0A0A0A] p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Zap size={24} className="text-white" />
                        <h1 className="text-xl font-bold text-white">RCT LAB</h1>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar size={14} />
                            <span>2025-05-24</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowEffectivenessMatrix(!showEffectivenessMatrix)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                        >
                            <TrendingUp size={14} />
                            {showEffectivenessMatrix ? "Hide Matrix" : "Effectiveness Matrix"}
                        </button>
                        <button
                            onClick={() => setShowIssues(!showIssues)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                        >
                            <Bug size={14} />
                            {showIssues ? "Hide Issues" : "View Issues"}
                        </button>
                        <button
                            onClick={handleStartNewTest}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                        >
                            <Plus size={14} />
                            New Test
                        </button>
                    </div>
                </div>

                {/* Download Buttons Row - Reduced size */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={async () => await downloadPDF("main")}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 rounded-lg"
                    >
                        <Download size={14} />
                        Main Report
                    </button>
                    <button
                        onClick={async () => await downloadPDF("ab")}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                    >
                        <BarChart3 size={14} />
                        A/B ({testSubmissions.filter((t) => t.testType === "ab").length})
                    </button>
                    <button
                        onClick={async () => await downloadPDF("usability")}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                    >
                        <Target size={14} />
                        Usability ({testSubmissions.filter((t) => t.testType === "usability").length})
                    </button>
                    <button
                        onClick={async () => await downloadPDF("preference")}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                    >
                        <Settings size={14} />
                        Preference ({testSubmissions.filter((t) => t.testType === "preference").length})
                    </button>
                </div>
            </div>

            {/* Scrollable Content Area - Fixed height calculation */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="p-4 space-y-4">
                    {/* Quick Stats Grid - Reduced size */}
                    <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                            <div className="flex items-center gap-2 mb-1">
                                <Users size={16} className="text-gray-400" />
                                <span className="text-gray-400 font-medium text-xs">Users</span>
                            </div>
                            <div className="text-xl font-bold text-white">5</div>
                        </div>
                        <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                            <div className="flex items-center gap-2 mb-1">
                                <TrendingUp size={16} className="text-[#197E10]" />
                                <span className="text-gray-400 font-medium text-xs">Success</span>
                            </div>
                            <div className="text-xl font-bold text-white">{calculateOverallSuccess()}%</div>
                        </div>
                        <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={16} className="text-[#2762EC]" />
                                <span className="text-gray-400 font-medium text-xs">Tests</span>
                            </div>
                            <div className="text-xl font-bold text-white">{testSubmissions.length}</div>
                        </div>
                        <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                            <div className="flex items-center gap-2 mb-1">
                                <Bug size={16} className="text-[#CC1922]" />
                                <span className="text-gray-400 font-medium text-xs">Issues</span>
                            </div>
                            <div className="text-xl font-bold text-white">
                                {appIssues.filter((issue) => issue.status === "open").length}
                            </div>
                        </div>
                    </div>

                    {/* User Personas - Single Row */}
                    <div>
                        <h2 className="text-lg font-bold text-white mb-3">User Personas</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {userPersonas.map((persona) => (
                                <button
                                    key={persona.id}
                                    className="p-2 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] hover:border-[#3A3A3A] hover:bg-gradient-to-br hover:from-[#2A2A2A] hover:to-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 text-left"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div>
                                            <h3 className="text-white font-bold text-xs">{persona.name}</h3>
                                            <p className="text-gray-400 text-xs">{persona.location}</p>
                                        </div>
                                        <div className="text-white font-bold text-xs">{persona.overallScore}/5</div>
                                    </div>
                                    <div className="text-gray-300 text-xs mb-1 truncate">{persona.car}</div>
                                    <div className="flex gap-1">
                                        {testResults.map((result, resultIndex) => {
                                            const userResult = result[persona.id as keyof TestResult] as "success" | "warning" | "error"
                                            return (
                                                <div key={resultIndex} className={`w-1.5 h-1.5 rounded-full ${getStatusColor(userResult)}`} />
                                            )
                                        })}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Feedback Effectiveness Matrix - Conditional */}
                    {showEffectivenessMatrix && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-3">User Feedback Effectiveness Matrix</h2>
                            <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b border-[#2A2A2A]">
                                            <th className="text-left py-2 px-2 text-gray-400 font-semibold text-xs">User</th>
                                            <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Focus</th>
                                            <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Relaxation</th>
                                            <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Satisfaction</th>
                                            <th className="text-left py-2 px-2 text-gray-400 font-semibold text-xs">Comments</th>
                                            <th className="text-left py-2 px-2 text-gray-400 font-semibold text-xs">
                                                Improvement Suggestions
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {effectivenessMatrix.map((row, rowIndex) => (
                                            <tr key={rowIndex} className="border-b border-[#1A1A1A]">
                                                <td className="py-2 px-2 text-white font-medium text-xs">{row.user}</td>
                                                <td className="py-2 px-1 text-center text-white text-xs">{row.focusImprovement}</td>
                                                <td className="py-2 px-1 text-center text-white text-xs">{row.relaxationEffect}</td>
                                                <td className="py-2 px-1 text-center text-white text-xs">{row.subjectiveSatisfaction}</td>
                                                <td className="py-2 px-2 text-gray-300 text-xs">{row.comments}</td>
                                                <td className="py-2 px-2 text-gray-300 text-xs">{row.suggestions}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Issues Panel - Conditional */}
                    {showIssues && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-3">User Feedback Issues</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {appIssues.map((issue) => (
                                    <div
                                        key={issue.id}
                                        className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]"
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="text-white font-semibold text-xs leading-tight">{issue.title}</h3>
                                            <div className="flex gap-1">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                                                <span
                                                    className={`px-1 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(issue.status)}`}
                                                >
                          {issue.status}
                        </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-400 text-xs mb-1">{issue.description}</p>
                                        <div className="text-gray-500 text-xs">Reported by: {issue.reportedBy.join(", ")}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Feature Performance Matrix - Compact */}
                    <div>
                        <h2 className="text-lg font-bold text-white mb-3">Feature Performance Matrix</h2>
                        <div className="p-3 rounded-lg border border-[#2A2A2A] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-[#2A2A2A]">
                                        <th className="text-left py-2 px-2 text-gray-400 font-semibold text-xs">Feature</th>
                                        <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Alex</th>
                                        <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Emma</th>
                                        <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Malcolm</th>
                                        <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Fabrice</th>
                                        <th className="text-center py-2 px-1 text-gray-400 font-semibold text-xs">Maristella</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {testResults.map((result, resultIndex) => (
                                        <tr key={resultIndex} className="border-b border-[#1A1A1A]">
                                            <td className="py-2 px-2 text-white font-medium text-xs">{result.feature}</td>
                                            <td className="py-2 px-1 text-center">
                                                <div className={`inline-flex p-0.5 rounded border ${getStatusColor(result.alex)}`}>
                                                    {getStatusIcon(result.alex)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                                <div className={`inline-flex p-0.5 rounded border ${getStatusColor(result.emma)}`}>
                                                    {getStatusIcon(result.emma)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                                <div className={`inline-flex p-0.5 rounded border ${getStatusColor(result.malcolm)}`}>
                                                    {getStatusIcon(result.malcolm)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                                <div className={`inline-flex p-0.5 rounded border ${getStatusColor(result.fabrice)}`}>
                                                    {getStatusIcon(result.fabrice)}
                                                </div>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                                <div className={`inline-flex p-0.5 rounded border ${getStatusColor(result.maristella)}`}>
                                                    {getStatusIcon(result.maristella)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Bottom padding to ensure scrolling works and proper spacing */}
                    <div className="h-16"></div>

                    {/* Bottom padding to ensure scrolling works */}
                    <div className="h-8"></div>
                </div>
            </div>

            {/* New Test Modal */}
            {showNewTestModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-lg border border-[#2A2A2A] p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        {currentStep === 1 && (
                            <>
                                <h2 className="text-xl font-bold text-white mb-4">Choose Test Type</h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleTestTypeSelect("ab")}
                                        className="w-full p-4 text-left rounded-lg border border-[#2A2A2A] bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] hover:border-[#3A3A3A] hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1A1A1A] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <BarChart3 size={24} className="text-[#2762EC]" />
                                            <h3 className="text-white font-bold">A/B Testing</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm">Compare two design variants to determine user preference</p>
                                    </button>
                                    <button
                                        onClick={() => handleTestTypeSelect("usability")}
                                        className="w-full p-4 text-left rounded-lg border border-[#2A2A2A] bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] hover:border-[#3A3A3A] hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1A1A1A] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Target size={24} className="text-[#197E10]" />
                                            <h3 className="text-white font-bold">Usability Testing</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm">Evaluate how easily users can complete specific tasks</p>
                                    </button>
                                    <button
                                        onClick={() => handleTestTypeSelect("preference")}
                                        className="w-full p-4 text-left rounded-lg border border-[#2A2A2A] bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] hover:border-[#3A3A3A] hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:to-[#1A1A1A] transition-all duration-200"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <Settings size={24} className="text-[#F3BE00]" />
                                            <h3 className="text-white font-bold">Preference Testing</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm">MaxDiff and Conjoint Analysis for feature preferences</p>
                                    </button>
                                </div>
                                <div className="flex justify-end mt-6">
                                    <button
                                        onClick={() => setShowNewTestModal(false)}
                                        className="px-4 py-2 text-sm font-semibold text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 2 && (
                            <>
                                <h2 className="text-xl font-bold text-white mb-4">User Information</h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-white font-semibold mb-2 text-sm">Name</label>
                                            <input
                                                type="text"
                                                value={userData.name}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white font-semibold mb-2 text-sm">Age</label>
                                            <input
                                                type="number"
                                                value={userData.age || ""}
                                                onChange={(e) =>
                                                    setUserData((prev) => ({ ...prev, age: Number.parseInt(e.target.value) || 0 }))
                                                }
                                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                                placeholder="Age"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-white font-semibold mb-2 text-sm">Location</label>
                                            <input
                                                type="text"
                                                value={userData.location}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, location: e.target.value }))}
                                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                                placeholder="City"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-white font-semibold mb-2 text-sm">Profession</label>
                                            <input
                                                type="text"
                                                value={userData.profession}
                                                onChange={(e) => setUserData((prev) => ({ ...prev, profession: e.target.value }))}
                                                className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                                placeholder="Your profession"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2 text-sm">Car</label>
                                        <input
                                            type="text"
                                            value={userData.car}
                                            onChange={(e) => setUserData((prev) => ({ ...prev, car: e.target.value }))}
                                            className="w-full p-2 rounded-lg bg-[#2A2A2A] border border-[#3A3A3A] text-white text-sm"
                                            placeholder="Car make and model"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-white font-semibold mb-2 text-sm">Tech Comfort Level (1-5)</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="5"
                                            value={userData.techComfort}
                                            onChange={(e) =>
                                                setUserData((prev) => ({ ...prev, techComfort: Number.parseInt(e.target.value) }))
                                            }
                                            className="w-full"
                                        />
                                        <div className="text-gray-400 text-sm">Level: {userData.techComfort}/5</div>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="px-4 py-2 text-sm font-semibold text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleUserFormSubmit}
                                        disabled={!userData.name || !userData.age}
                                        className="px-4 py-2 text-sm font-bold text-black bg-white hover:bg-gray-100 rounded-lg disabled:opacity-50"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <>
                                {renderTestQuestions()}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="px-4 py-2 text-sm font-semibold text-gray-300 bg-[#2A2A2A] hover:bg-[#3A3A3A] rounded-lg"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleTestSubmit}
                                        className="px-4 py-2 text-sm font-bold text-black bg-white hover:bg-gray-100 rounded-lg"
                                    >
                                        Submit Test
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
