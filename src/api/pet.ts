export interface Pet {
    name: string
    img: string
    tagId: number
    sensorData: Array<SensorData> | null
}

export interface SensorData {
    time: number
    heartRate: number
    longitude: number
    latitude: number
}