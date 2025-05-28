// Type definitions for Screen Orientation API
// This helps TypeScript understand the Screen Orientation API

interface ScreenOrientation {
    angle: number
    type: string
    onchange: ((this: ScreenOrientation, ev: Event) => any) | null
    lock(orientation: string): Promise<void>
    unlock(): void
    addEventListener<K extends keyof ScreenOrientationEventMap>(
        type: K,
        listener: (this: ScreenOrientation, ev: ScreenOrientationEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void
    removeEventListener<K extends keyof ScreenOrientationEventMap>(
        type: K,
        listener: (this: ScreenOrientation, ev: ScreenOrientationEventMap[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void
}

interface ScreenOrientationEventMap {
    change: Event
}

interface Screen {
    orientation?: ScreenOrientation
}
