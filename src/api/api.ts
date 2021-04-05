import {Pet, SensorData} from './pet'

const baseUrl = "https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/"

let apiUsername = ""

export async function getPets(username: string): Promise<Array<Pet>> {
    apiUsername = username;

    return fetch(baseUrl + "dev/users/" + username + "/tags/")
        .then(res =>
            res.json()
        )
        .then(json => {
            return json.result.Items.map(
                (item: any) => {
                    const pet: Pet = {
                        name: item.SK.substr(4),
                        img: item.img,
                        tagId: item.tagId,
                        geofence: item.geofence,
                        sensorData: null
                    }
                    return pet
                }
            )
        })
}

export async function getSensorData(tagId: number): Promise<Array<SensorData>> {
    return fetch(baseUrl + "dev/tags/" + tagId + "/sensors")
        .then(res =>
            res.json()
        )
        .then(json => {
            return json.result.Items.map(
                (item: any) => {
                    const data: SensorData = {
                        time: item.time,
                        heartRate: item.heartRate,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        activity: item.activity,
                        temperature: item.temperature
                    }
                    return data
                }
            ).filter(
                (data: SensorData) => {
                    return data.time && data.heartRate && data.latitude && data.longitude
                }
            ).filter(
                (data: SensorData, index:number, arr: SensorData[]) => {
                    return data.time >= arr[0].time - 24 * 60 * 60;
                }
            ).sort((a: SensorData, b: SensorData) => { return a.time > b.time })
        })
}

export async function patchGeofence(petName: string, geofence: Array<[number, number]>) {
    return fetch(
        `https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/${apiUsername}/tags/`,
        {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                petName: petName,
                geofence: geofence
            }),
        })
}