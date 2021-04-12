import {Toast} from "react-bootstrap";
import React from "react";

export interface Notification {
    header: string,
    petName: string,
    temperature: string,
    time: number,
}

export function messageBody(data: Notification): string {
    switch(data.header) {
        case "Geofencing Triggered":
            return `${data.petName} is outside of geofence`
        case "Poaching Alert":
            return `Detected unknown person in close proximity to ${data.petName}`
        case "Unusual Activity":
            return `${data.petName} is behaving erratically`
        case "Extreme Temperature":
            return `Temperature environment close to ${data.petName} is ${data.temperature}°C`
        default:
            return ""
    }
}

export function NotificationToast(data: Notification, fun: () => void): JSX.Element {

    const humanDateFormat: string = (new Date(data.time * 1000)).toLocaleTimeString()

    return (
        (
            <Toast onClose={() => fun()}>
                <Toast.Header>
                    <i className="fas fa-square" color="red"/>
                    <strong className="mr-auto">{data.header}&nbsp;&nbsp;</strong>
                    <small>{humanDateFormat}</small>
                </Toast.Header>
                <Toast.Body>{messageBody(data)}</Toast.Body>
            </Toast>
        )
    )
}