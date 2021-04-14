/* Datatypes for the Pet. Used by TS to type check */

export interface Pet {
    name: string
    img: string
    tagId: string
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