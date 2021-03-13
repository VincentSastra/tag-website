import React, {
    Ref, useEffect, useState
} from "react";
import './Maps.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import L, {LatLng} from "leaflet";
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

export interface MapWidgetProps {
    petList: Array<Pet>
}

export function MapWidget(props: MapWidgetProps): JSX.Element {

    const [center, setCenter] = useState({lat: 0, lng: 0})
    const [map, setMap] = useState<any>(null)

    const petMarkers: Array<JSX.Element> = props.petList
        .filter(
            (pet: Pet) => {
                // @ts-ignore
                return pet.sensorData !== null && pet.sensorData.length > 0
            }
        )
        .map(
            (pet: Pet) => {
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

    useEffect(() => {
        let val = props.petList
            .filter(
                (pet: Pet) => {
                    return pet.sensorData !== null && pet.sensorData.length > 0
                }
            )
            .reduce(
                (coor: coordinate,  pet: Pet) => {
                    console.log(pet)
                    // @ts-ignore
                    coor.lat += pet.sensorData[0].latitude
                    // @ts-ignore
                    coor.lng += pet.sensorData[0].longitude
                    console.log(coor)
                    return coor
                }, {lng: 0, lat: 0}
            )

        setCenter(val)
    }, [props.petList])

    useEffect(() => {
        if (map !== null) {
            map.setView([center.lat, center.lng], map.getZoom())
        }
    }, [center])

    return (
            <MapContainer
                whenCreated={map => {
                    setMap(map)
                    // The only way to fix this bug.
                    setTimeout(() => map.invalidateSize(), 10)
                }}

                center={[center.lat, center.lng]}
                zoom={18}
                scrollWheelZoom={false}>

                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {petMarkers}
            </MapContainer>
    )
}