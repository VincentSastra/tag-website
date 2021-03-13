import React, {
    Ref
} from "react";
import './Maps.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import L from "leaflet";
import {Pet} from "../../api/pet";
import {coordinate} from "../../utils";

const size = 40

// let fence: Array<[number, number]> = [[49.265375, -123.231737], [49.264975, -123.231037], [49.265475, -123.230737]]

const pinIcon = L.icon({
    iconUrl: 'pin-icon.png',
    iconSize: [size,size],
    iconAnchor: [size / 2,size],
})

export interface MapWidgetRef {
    refreshMap: () => void;
}

export function MapWidget(petList: Array<Pet>): JSX.Element {

    const petMarkers: Array<JSX.Element> = petList
        .filter(
            (pet: Pet) => {
                // @ts-ignore
                return pet.sensorData !== null && pet.sensorData.length > 0
            }
        )
        .map(
            (pet: Pet) => {
                console.log(pet)
                return (
                    // @ts-ignore
                    <Marker icon={pinIcon} position={[pet.sensorData[0].latitude, pet.sensorData[0].longitude]}>
                        <Popup>
                            {pet.name}
                        </Popup>
                    </Marker>
                )
            }
        )

    const center: coordinate = petList
        .filter(
            (pet: Pet) => {
                return pet.sensorData !== null && pet.sensorData.length > 0
            }
        )
        .reduce(
            (coor: coordinate,  pet: Pet) => {
                // @ts-ignore
                coor.long += pet.sensorData[0].longitude
                // @ts-ignore
                coor.lang += pet.sensorData[0].latitude
                return coor
            }, {long: 0, lang: 0}
        )

    return (
            <MapContainer whenCreated={map => {
                // The only way to fix this bug.
                setTimeout(() => map.invalidateSize(), 10)
            }} center={[center.lang, center.long]} zoom={18} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {petMarkers}
            </MapContainer>
    )
}