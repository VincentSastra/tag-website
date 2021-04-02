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

const heatLayerOptions = {
    blur: 80,
    radius: 50
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

function isMapVisible(map: L.Map): boolean {
    return map.getContainer().clientHeight > 0 && map.getContainer().clientWidth > 0
}

export function MapWidget(props: MapWidgetProps): JSX.Element {

    const [center, setCenter] = useState({lat: 0, lng: 0})
    const [map, setMap] = useState<any>(null)
    const [heatLayer, setHeatLayer] = useState<any>(null)

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
        let petListSize = 0;

        let val = props.petList
            .filter(
                (pet: Pet) => {
                    return pet.sensorData !== null && pet.sensorData.length > 0
                }
            )
            .reduce(
                (coor: coordinate,  pet: Pet) => {
                    petListSize++;
                    // @ts-ignore
                    coor.lat += pet.sensorData[0].latitude
                    // @ts-ignore
                    coor.lng += pet.sensorData[0].longitude
                    return coor
                }, {lng: 0, lat: 0}
            )
        if (petListSize === 0) {
            setCenter(val)
        } else {
            setCenter({lng: val.lng / petListSize, lat: val.lat /  petListSize})
        }

        if (map !== null && heatLayer !== null && isMapVisible(map)) {
            let petCoordinate: {lat: number, lng: number}[] = []
            props.petList.forEach(
                pet => pet.sensorData?.forEach(data => petCoordinate.push(
                    {
                        lat: data.latitude,
                        lng: data.longitude
                    }
                ))
            )

            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            heatLayer.setLatLngs(petCoordinate)
        }
    }, [props.petList, map, heatLayer])

    useEffect(() => {
        if (map !== null) {
            map.setView([center.lat, center.lng], map.getZoom())
        }
    }, [center])

    return (
            <MapContainer
                whenCreated={map => {
                    setMap(map)

                    if (isMapVisible(map)) {
                        // @ts-ignore
                        let heat = L.heatLayer([], heatLayerOptions).addTo(map)
                        setHeatLayer(heat)

                        map.setView([center.lat, center.lng], map.getZoom())
                    }

                    setTimeout(() => map.invalidateSize(), 50)
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