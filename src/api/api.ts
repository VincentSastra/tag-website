import {Pet, SensorData} from './pet'

const baseUrl = "https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/"

export async function getPets(username: string): Promise<Array<Pet>> {
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
                        time: item.SK,
                        heartRate: item.HeartRate,
                        latitude: item.Latitude,
                        longitude: item.Longitude
                    }
                    return data
                }
            ).filter(
                (data: SensorData) => {
                    return data.time && data.heartRate && data.latitude && data.longitude
                }
            )
        })
}