export interface OpenWeatherResponse {
    name: string
    main: {
        temp: number
        temp_min: number
        temp_max: number
        humidity: number
        pressure: number
    }
    weather: Array<{
        id: number
        main: string
        description: string
        icon: string
    }>
    wind: {
        speed: number
        deg: number
    }
    coord: {
        lat: number
        lon: number
    }
}
