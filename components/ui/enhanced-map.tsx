/**
 * @fileoverview Map Component
 * @description Interactive map with navigation route and vehicle position for driving scenarios.
 * @functionality Displays route, vehicle position, and navigation instructions with smooth animations.
 * @styling Uses Leaflet CSS with custom styling in app/styles/map-styles.css for route and markers.
 * @layout Full-screen map with overlaid navigation elements and animated vehicle marker.
 */

"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Create a dynamic import for the map content to avoid SSR issues
const MapContent = dynamic(
    () =>
        Promise.resolve(() => {
            const mapRef = useRef<HTMLDivElement>(null)
            const mapInstanceRef = useRef<any>(null)
            const [isMapLoaded, setIsMapLoaded] = useState(false)

            useEffect(() => {
                // Only run this effect in the browser
                if (typeof window === "undefined") return

                let cleanup: (() => void) | null = null

                const initializeMap = async () => {
                    if (!mapRef.current) return

                    // Check if map is already initialized
                    if (mapInstanceRef.current) {
                        console.log("Map already exists, skipping initialization")
                        return
                    }

                    try {
                        // Dynamically import Leaflet
                        const L = await import("leaflet")

                        // Add validation function for coordinates
                        function isValidLatLng(lat: number, lng: number): boolean {
                            return (
                                !isNaN(lat) &&
                                !isNaN(lng) &&
                                isFinite(lat) &&
                                isFinite(lng) &&
                                lat >= -90 &&
                                lat <= 90 &&
                                lng >= -180 &&
                                lng <= 180
                            )
                        }

                        // Clear any existing content in the map container
                        if (mapRef.current) {
                            mapRef.current.innerHTML = ""
                        }

                        // Load Leaflet CSS
                        const link = document.createElement("link")
                        link.rel = "stylesheet"
                        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                        if (!document.head.contains(link)) {
                            document.head.appendChild(link)
                        }

                        // Initialize map with natural GPS-style view
                        const map = L.map(mapRef.current, {
                            center: [51.0259, 4.4776], // Thomas More Mechelen
                            zoom: 16, // Good zoom for navigation
                            zoomControl: false,
                            attributionControl: false,
                            scrollWheelZoom: false,
                            dragging: false,
                            keyboard: false,
                            preferCanvas: true,
                        })

                        // Store map instance
                        mapInstanceRef.current = map

                        // Add DARK map tiles - using a reliable dark theme
                        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
                            maxZoom: 19,
                            attribution: "",
                            subdomains: "abcd",
                            crossOrigin: true,
                        }).addTo(map)

                        // Add SVG gradient definition for the route
                        const svgContainer = document.createElement("div")
                        svgContainer.innerHTML = `
<svg width="0" height="0" style="position:absolute;">
  <defs>
    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff8800;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>`
                        document.body.appendChild(svgContainer)

                        // Trigger map ready event when map is fully loaded
                        map.whenReady(() => {
                            setTimeout(() => {
                                setIsMapLoaded(true)
                                const event = new CustomEvent("mapReady")
                                window.dispatchEvent(event)
                            }, 1500)
                        })

                        // Create route with more points for smoother movement
                        const routePoints = [
                            [51.0259, 4.4776], // Thomas More Mechelen
                            [51.027, 4.477], // Local street 1
                            [51.028, 4.476], // Local street 2
                            [51.029, 4.475], // Local street 3
                            [51.03, 4.474], // Local street 4
                            [51.032, 4.468], // Approaching highway
                            [51.034, 4.462], // Highway approach
                            [51.0378, 4.4431], // Join E19
                            [51.05, 4.43], // E19 progress 1
                            [51.07, 4.42], // E19 progress 2
                            [51.09, 4.415], // E19 progress 3
                            [51.12, 4.41], // E19 continued
                            [51.1543, 4.4145], // Antwerp area
                            [51.18, 4.0], // Antwerp Ring
                            [51.2, 3.99], // Ring continued
                            [51.2465, 3.9812], // E34 junction
                            [51.26, 3.8], // E34 progress 1
                            [51.28, 3.7], // E34 progress 2
                            [51.3, 3.6], // E34 progress 3
                            [51.31, 3.5], // E34 continued
                            [51.32, 3.48], // E34 continued 2
                            [51.3243, 3.4521], // Near Bruges
                            [51.33, 3.4], // Approaching coast 1
                            [51.34, 3.35], // Approaching coast 2
                            [51.3504, 3.2877], // Knokke-Heist destination
                        ]

                        // Navigation instructions for key points
                        const navigationInstructions = [
                            { point: 0, instruction: "Start on Zandpoortvest", distance: "500 ft" },
                            { point: 7, instruction: "Join E19 toward Antwerp", distance: "1200 ft" },
                            { point: 12, instruction: "Continue through Antwerp", distance: "2.5 mi" },
                            { point: 15, instruction: "Take exit to E34", distance: "800 ft" },
                            { point: 21, instruction: "Continue on E34", distance: "5.2 mi" },
                            { point: 24, instruction: "Arrive at destination", distance: "200 ft" },
                        ]

                        // Create route with proper typing
                        const createRoute = (points: L.LatLngExpression[], isPassed = false) => {
                            if (isPassed) {
                                // Grey, thin, and nearly invisible for passed route
                                return L.polyline(points, {
                                    color: "#666666",
                                    weight: 3,
                                    opacity: 0.4,
                                    className: "passed-route",
                                    lineCap: "round",
                                    lineJoin: "round",
                                })
                            } else {
                                // Red gradient with glow effect for upcoming route
                                const polyline = L.polyline(points, {
                                    stroke: true,
                                    color: "url(#routeGradient)",
                                    weight: 6,
                                    opacity: 0.9,
                                    className: "upcoming-route gradient-route",
                                    lineCap: "round",
                                    lineJoin: "round",
                                })

                                // Add a second wider line underneath for glow effect
                                const glowLine = L.polyline(points, {
                                    stroke: true,
                                    color: "#ff3333",
                                    weight: 12,
                                    opacity: 0.3,
                                    className: "route-glow",
                                    lineCap: "round",
                                    lineJoin: "round",
                                })

                                // Create a layerGroup to return both lines together
                                return L.layerGroup([glowLine, polyline])
                            }
                        }

                        // Initialize routes
                        let upcomingRoute: L.Polyline | L.LayerGroup = createRoute(routePoints as L.LatLngExpression[])
                        if (upcomingRoute instanceof L.LayerGroup) {
                            upcomingRoute.addTo(map)
                        } else {
                            upcomingRoute.addTo(map)
                        }

                        let passedRoute: L.Polyline | L.LayerGroup | null = null

                        // Add destination marker
                        const destinationIcon = L.divIcon({
                            html: `<div class="destination-marker">
                  <div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div class="destination-pulse"></div>
                </div>`,
                            className: "destination-marker-container",
                            iconSize: [24, 24],
                            iconAnchor: [12, 12],
                        })

                        // Create destination marker and add to map
                        L.marker(routePoints[routePoints.length - 1] as L.LatLngExpression, {
                            icon: destinationIcon,
                        }).addTo(map)

                        // Create car marker with proper styling
                        const carIcon = L.divIcon({
                            html: `<div class="car-marker">
                  <img src="/car.png" alt="Car" class="car-icon" />
                  <div class="car-glow"></div>
                </div>`,
                            className: "car-marker-container",
                            iconSize: [100, 50],
                            iconAnchor: [50, 25],
                        })

                        const carMarker = L.marker(routePoints[0] as L.LatLngExpression, {
                            icon: carIcon,
                            zIndexOffset: 1000,
                        }).addTo(map)

                        // Animation variables
                        let currentSegmentIndex = 0
                        let segmentProgress = 0
                        let currentInstructionIndex = 0
                        const passedPoints: L.LatLngExpression[] = [routePoints[0] as L.LatLngExpression]
                        let animationId: number

                        // Function to calculate bearing for car rotation
                        function getBearing(start: L.LatLng, end: L.LatLng) {
                            const lat1 = (start.lat * Math.PI) / 180
                            const lat2 = (end.lat * Math.PI) / 180
                            const deltaLng = ((end.lng - start.lng) * Math.PI) / 180

                            const y = Math.sin(deltaLng) * Math.cos(lat2)
                            const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng)

                            let bearing = (Math.atan2(y, x) * 180) / Math.PI
                            bearing = (bearing + 360) % 360
                            return bearing
                        }

                        // Smooth interpolation between two points
                        function interpolateLatLng(start: L.LatLng, end: L.LatLng, progress: number): L.LatLng {
                            const easedProgress = 1 - Math.pow(1 - progress, 3)
                            const lat = start.lat + (end.lat - start.lat) * easedProgress
                            const lng = start.lng + (end.lng - start.lng) * easedProgress
                            return L.latLng(lat, lng)
                        }

                        // Function to position car at bottom of screen and show route ahead
                        function updateNavigationView(currentPos: L.LatLng, bearing: number) {
                            try {
                                // Validate input coordinates
                                if (!currentPos || !isValidLatLng(currentPos.lat, currentPos.lng)) {
                                    console.warn("Invalid currentPos coordinates:", currentPos)
                                    return
                                }

                                // Validate bearing
                                if (isNaN(bearing) || !isFinite(bearing)) {
                                    console.warn("Invalid bearing:", bearing)
                                    bearing = 0 // Default to north
                                }

                                const mapContainer = map.getContainer()
                                if (!mapContainer) {
                                    console.warn("Map container not available")
                                    return
                                }

                                const mapHeight = mapContainer.offsetHeight
                                if (!mapHeight || mapHeight <= 0) {
                                    console.warn("Invalid map height:", mapHeight)
                                    return
                                }

                                const pixelOffset = mapHeight * 0.3
                                const zoom = map.getZoom()
                                const latOffset = (pixelOffset / mapHeight) * (0.01 * Math.pow(2, 16 - zoom))
                                const bearingRad = (bearing * Math.PI) / 180
                                const centerLat = currentPos.lat + latOffset * Math.cos(bearingRad)
                                const centerLng = currentPos.lng + latOffset * Math.sin(bearingRad)

                                // Validate calculated coordinates before setting view
                                if (!isValidLatLng(centerLat, centerLng)) {
                                    console.warn("Calculated invalid center coordinates:", centerLat, centerLng)
                                    // Fallback to current position
                                    map.setView([currentPos.lat, currentPos.lng], map.getZoom(), {
                                        animate: true,
                                        duration: 0.3,
                                    })
                                } else {
                                    map.setView([centerLat, centerLng], map.getZoom(), {
                                        animate: true,
                                        duration: 0.3,
                                    })
                                }

                                // Update car rotation
                                const carElement = carMarker.getElement()
                                if (carElement) {
                                    const carIconElement = carElement.querySelector(".car-icon") as HTMLElement
                                    if (carIconElement) {
                                        carIconElement.style.transition = "transform 0.2s ease-out"
                                        carIconElement.style.transform = `rotate(${bearing}deg)`
                                        carIconElement.style.transformOrigin = "center center"
                                    }
                                }
                            } catch (error) {
                                console.error("Error in updateNavigationView:", error)
                            }
                        }

                        // Animation function
                        function animateMovement() {
                            if (currentSegmentIndex >= routePoints.length - 1) {
                                return
                            }

                            segmentProgress += 0.003

                            if (segmentProgress >= 1) {
                                currentSegmentIndex++
                                segmentProgress = 0

                                if (currentSegmentIndex < routePoints.length - 1) {
                                    passedPoints.push(routePoints[currentSegmentIndex] as L.LatLngExpression)

                                    if (passedRoute) {
                                        map.removeLayer(passedRoute)
                                    }
                                    passedRoute = createRoute(passedPoints, true)
                                    if (passedRoute instanceof L.LayerGroup) {
                                        passedRoute.addTo(map)
                                    } else {
                                        passedRoute.addTo(map)
                                    }

                                    const remainingPoints = routePoints.slice(currentSegmentIndex)
                                    map.removeLayer(upcomingRoute)
                                    upcomingRoute = createRoute(remainingPoints as L.LatLngExpression[], false)
                                    if (upcomingRoute instanceof L.LayerGroup) {
                                        upcomingRoute.addTo(map)
                                    } else {
                                        upcomingRoute.addTo(map)
                                    }

                                    const currentInstruction = navigationInstructions.find((inst) => inst.point === currentSegmentIndex)
                                    if (currentInstruction) {
                                        currentInstructionIndex++

                                        const event = new CustomEvent("navigationUpdate", {
                                            detail: {
                                                pointIndex: currentSegmentIndex,
                                                instruction: currentInstruction,
                                                bearing: 0,
                                            },
                                        })
                                        window.dispatchEvent(event)
                                    }
                                }
                            }

                            if (currentSegmentIndex < routePoints.length - 1) {
                                const currentPoint = L.latLng(routePoints[currentSegmentIndex] as L.LatLngExpression)
                                const nextPoint = L.latLng(routePoints[currentSegmentIndex + 1] as L.LatLngExpression)

                                // Validate points before interpolation
                                if (isValidLatLng(currentPoint.lat, currentPoint.lng) && isValidLatLng(nextPoint.lat, nextPoint.lng)) {
                                    const interpolatedPosition = interpolateLatLng(currentPoint, nextPoint, segmentProgress)
                                    const bearing = getBearing(currentPoint, nextPoint)

                                    carMarker.setLatLng(interpolatedPosition)
                                    updateNavigationView(interpolatedPosition, bearing)
                                } else {
                                    console.warn("Invalid route points detected:", currentPoint, nextPoint)
                                }
                            }

                            animationId = requestAnimationFrame(animateMovement)
                        }

                        // Start animation
                        animationId = requestAnimationFrame(animateMovement)

                        // Setup cleanup function
                        cleanup = () => {
                            if (animationId) {
                                cancelAnimationFrame(animationId)
                            }

                            if (mapInstanceRef.current) {
                                mapInstanceRef.current.remove()
                                mapInstanceRef.current = null
                            }

                            if (document.body.contains(svgContainer)) {
                                document.body.removeChild(svgContainer)
                            }
                        }
                    } catch (error) {
                        console.error("Error initializing map:", error)
                    }
                }

                // Add a small delay to ensure DOM is ready
                const timeoutId = setTimeout(initializeMap, 100)

                // Cleanup function
                return () => {
                    clearTimeout(timeoutId)
                    if (cleanup) {
                        cleanup()
                    }
                }
            }, [])

            return (
                <div className="relative w-full h-full">
                    <div ref={mapRef} className="w-full h-full natural-navigation-map" />
                    {!isMapLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                            <div className="text-white text-lg">Loading map...</div>
                        </div>
                    )}
                </div>
            )
        }),
    { ssr: false },
)

export function EnhancedMap() {
    return <MapContent />
}
