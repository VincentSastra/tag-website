export interface Pet {
    name: string
    img: string
    tagId: number
    geofence: Array<[number, number]>
    sensorData: Array<SensorData> | null
}

export interface SensorData {
    time: number
    heartRate: number
    longitude: number
    latitude: number
    temperature: number
    activity: string
}