import React from "react";
import './Maps.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup, Polygon} from 'react-leaflet'
import L from "leaflet";

const size = 40

let fence: Array<[number, number]> = [[49.265375, -123.231737], [49.264975, -123.231037], [49.265475, -123.230737]]


const pinIcon = L.icon({
    iconUrl: 'pin-icon.png',
    iconSize: [size,size],
    iconAnchor: [size / 2,size],
})

export function MapWidget(): JSX.Element {
    return (
            <MapContainer dragging={false} center={[49.265275, -123.231037]} zoom={18} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker icon={pinIcon} position={[49.265275, -123.231037]}>
                    <Popup>
                        Eva
                    </Popup>
                </Marker>

                <Marker icon={pinIcon} position={[49.265005, -123.231067]}>
                    <Popup>
                        Oreo
                    </Popup>
                </Marker>


                <Marker icon={pinIcon} position={[49.265175, -123.231337]}>
                    <Popup>
                        Popi
                    </Popup>
                </Marker>


                <Marker icon={pinIcon} position={[49.265335, -123.230957]}>
                    <Popup>
                        Kucing
                    </Popup>
                </Marker>

                <Polygon positions={fence} />
            </MapContainer>
    )
}