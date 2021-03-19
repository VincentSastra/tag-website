import React, {
    Ref, useEffect, useState
} from "react";
import './Maps.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import L from "leaflet";
import {Pet} from "../../api/pet";
import {coordinate} from "../../utils";
import "leaflet.heat"

const size = 40

const cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 2,
    "maxOpacity": .8,
    // scales the radius based on map zoom
    "scaleRadius": true,
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
}

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
                    <Marker key={pet.tagId} icon={pinIcon} position={[pet.sensorData[0].latitude, pet.sensorData[0].longitude]}>
                        <Popup>
                            {pet.name}
                        </Popup>
                    </Marker>
                )
            }
        )

    useEffect(() => {
        console.log(props.petList)
        let val = props.petList
            .filter(
                (pet: Pet) => {
                    return pet.sensorData !== null && pet.sensorData.length > 0
                }
            )
            .reduce(
                (coor: coordinate,  pet: Pet) => {
                    // @ts-ignore
                    coor.lat += pet.sensorData[0].latitude
                    // @ts-ignore
                    coor.lng += pet.sensorData[0].longitude
                    return coor
                }, {lng: 0, lat: 0}
            )
        if (props.petList.length === 0) {
            setCenter(val)
        } else {
            setCenter({lng: val.lng / props.petList.length, lat: val.lat / props.petList.length})
        }

        if (map !== null) {
            let petCoordinate: number[][] = []
            props.petList.forEach(
                pet => pet.sensorData?.forEach(data => petCoordinate.push(
                    [data.latitude, data.longitude]
                ))
            )

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            L.heatLayer(petCoordinate).addTo(map)
        }
    }, [props.petList, map])

    useEffect(() => {
        if (map !== null) {
            map.setView([center.lat, center.lng], map.getZoom())
        }
    }, [center])

    return (
            <MapContainer
                whenCreated={map => {
                    setMap(map)
                    map.setView([center.lat, center.lng], map.getZoom())
                    // The only way to fix this bug.
                    setTimeout(() => map.invalidateSize(), 100)
                    map.setView([center.lat, center.lng], map.getZoom())
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