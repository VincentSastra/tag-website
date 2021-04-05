import React, {
    useEffect, useState
} from "react";
import './Maps.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker, Popup, Polygon, MapConsumer} from 'react-leaflet'
import L from "leaflet";
import {Pet} from "../../api/pet";
import {coordinate} from "../../utils";
import "leaflet.heat"
import {Button} from "react-bootstrap";
import {patchGeofence} from "../../api/api";

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
    singlePetMode: boolean
}

function isMapVisible(map: L.Map): boolean {
    return map.getContainer().clientHeight > 0 && map.getContainer().clientWidth > 0
}

function GeofenceEditor(mutableGeofence: Array<[number, number]>, setGeofence: (t: Array<[number, number]>) => void, editing: boolean) {

    let firstLoad = true

    return (
        <MapConsumer>
            {(map) => {
                if (firstLoad) {
                    firstLoad = false

                    map.on("click", function (e) {
                        if (editing) {
                            // @ts-ignore
                            let { lat, lng } = e.latlng
                            if (!mutableGeofence.includes([lat, lng])) {
                                mutableGeofence.push([lat, lng])
                                console.log(mutableGeofence)
                                setGeofence([...mutableGeofence])
                            }
                        }

                    });
                }

                if (!editing) {
                    map.off("click")
                }
                console.log(editing)
                return null
            }}
        </MapConsumer>
    )
}

export function MapWidget(props: MapWidgetProps): JSX.Element {

    const [center, setCenter] = useState({lat: 0, lng: 0})
    const [map, setMap] = useState<any>(null)
    const [heatLayer, setHeatLayer] = useState<any>(null)
    const [editing, setEditing] = useState(false)

    let mutableGeofence: Array<[number, number]> = props.petList[0]?.geofence !== undefined ? [...props.petList[0].geofence] : [];

    const [geofence, setGeofence] = useState<Array<[number, number]>>(mutableGeofence)

    const [geofenceWidget, setGeofenceWidget] = useState(GeofenceEditor(mutableGeofence, setGeofence, editing))

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

    const petListGeofence: Array<JSX.Element> = props.petList
        .filter((pet: Pet) => pet.geofence)
        .map(
            (pet: Pet) => {
                return (
                    <Polygon positions={pet.geofence} />
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
            console.log(center)
            map.setView([center.lat, center.lng], map.getZoom())
        }
    }, [center])

    return (
        <div style={{width:'100%'}}>
            {props.singlePetMode ? (
                <div style={{ margin: '15px', display: props.singlePetMode ? 'block' : 'hidden'}}>
                    <Button onClick={() => {
                        if (editing) {
                            console.log(geofence)
                            props.petList[0].geofence = [...geofence]
                            patchGeofence(props.petList[0].tagId , props.petList[0].geofence)
                        }
                        setGeofenceWidget(GeofenceEditor(mutableGeofence, setGeofence, !editing))
                        setEditing(!editing)
                    }}>
                        { editing ? "Save" : "Edit"}
                    </Button>{' '}
                    {editing ? (<Button variant="danger" onClick={() => {
                        mutableGeofence = []
                        setGeofence([...mutableGeofence])
                        setGeofenceWidget(GeofenceEditor(mutableGeofence, setGeofence, editing))
                    }}>
                        Clear
                    </Button>) : null}{' '}
                    {editing ? (<Button variant="danger" onClick={() => {
                        mutableGeofence = [...props.petList[0].geofence]
                        setGeofence([...mutableGeofence])
                        setGeofenceWidget(GeofenceEditor(mutableGeofence, setGeofence, !editing))
                        setEditing(!editing)
                    }}>
                        Cancel
                    </Button>) : null}
                </div>
            ) : null}
            <div>
                <MapContainer
                    whenCreated={map => {
                        setMap(map)

                        if (isMapVisible(map)) {
                            // @ts-ignore
                            let heat = L.heatLayer([], heatLayerOptions).addTo(map)
                            setHeatLayer(heat)

                            map.setView([center.lat, center.lng], map.getZoom())
                        }
                        setTimeout(() => map.invalidateSize(), 300)

                    }}

                    center={[center.lat, center.lng]}
                    zoom={18}
                    scrollWheelZoom={false}>

                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {geofenceWidget}
                    {petMarkers}
                    {props.singlePetMode ? (<Polygon positions={geofence}/>) : petListGeofence}
                </MapContainer>
            </div>
        </div>
    )
}