import {Pet, SensorData} from './pet'
import Auth from "@aws-amplify/auth";
import {Notification} from "../components/widget/NotificationToast";

const baseUrl = "https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/"

// Return a promise of array of pets
export async function getPets(): Promise<Array<Pet>> {
    const userInfo  = await Auth.currentUserInfo();
    if (userInfo === null) {
        return []
    }

    const username = userInfo.username

    return fetch(baseUrl + `dev/users/${username}/tags/`)
        .then(res =>
            res.json()
        )
        .then(json => {
            return json.result.Items.map(
                (item: any) => {
                    const pet: Pet = {
                        name: item.petName,
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

// Get the notifications for the user
export async function getNotificationArray(): Promise<Array<Notification>> {
    const userInfo  = await Auth.currentUserInfo();
    if (userInfo === null) {
        return []
    }

    const username = userInfo.username

    return fetch(baseUrl + `dev/notifications/${username}`)
        .then(res =>
            res.json()
        )
        .then(json => {
            console.log(json.result.Items)
            return json.result.Items
        })
}

// Get the sensor data of a specific pet tag
export async function getSensorData(tagId: string): Promise<Array<SensorData>> {
    return fetch(baseUrl + "dev/tags/" + tagId + "/sensors")
        .then(res =>
            res.json()
        )
        .then(json => {
            return json.result.Items.map(
                (item: any) => {
                    const data: SensorData = {
                        time: parseInt(item.time),
                        heartRate: parseInt(item.heartRate),
                        latitude: parseFloat(item.latitude),
                        longitude: parseFloat(item.longitude),
                        activity: item.activity,
                        temperature: parseInt(item.temperature)
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
            ).sort((a: SensorData, b: SensorData) => { return a.time < b.time })
        })
}

// Push a new set of Geofence coordinate for a specific Pet
export async function patchGeofence(tagId: string, geofence: Array<[number, number]>) {
    const { username } = await Auth.currentUserInfo();

    console.log("patching")

    return fetch(
        `https://k7t0ap6b0i.execute-api.us-west-2.amazonaws.com/dev/users/${username}/tags/`,
        {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                tagId: tagId,
                geofence: geofence
            }),
        })
}