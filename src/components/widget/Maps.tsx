import React, {
    useEffect, useLayoutEffect, useState
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

// Is a Leaflet Map visible
function isMapVisible(map: L.Map): boolean {
    return map.getContainer().clientHeight > 0 && map.getContainer().clientWidth > 0
}

// A Map Consumer that mutates the mutableGeofence array & calls the setGeofence when editing is true and the user clicks on the map
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

// The Map Widget component
export function MapWidget(props: MapWidgetProps): JSX.Element {

    /*
        STATES.
     */

    // Center of the map
    const [center, setCenter] = useState({lat: 0, lng: 0})

    // Leaflet Map component
    const [map, setMap] = useState<any>(null)

    // the Leafletlet Heatlayer object
    const [heatLayer, setHeatLayer] = useState<any>(null)

    // A boolean if the user is editing the Geofence
    const [editing, setEditing] = useState(false)

    // A mutable array for the geofence coordinates. The assignment is just a copy of the first pet's geofence coordinate
    // Remains unused if the petList have more than 1 pet
    let mutableGeofence: Array<[number, number]> = props.petList[0]?.geofence !== undefined ? [...props.petList[0].geofence] : [];

    // An array of geofence itself. By default it is the mutableGeofence, however if there is multiple pets, it will be unused
    const [geofence, setGeofence] = useState<Array<[number, number]>>(mutableGeofence)

    // The Geofence Editor component from line 42
    const [geofenceWidget, setGeofenceWidget] = useState(GeofenceEditor(mutableGeofence, setGeofence, editing))

    // Create the markers from each pet's coordinate
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

    // If in multi pet mode, this will generate the polygons for each pet
    const petListGeofence: Array<JSX.Element> = props.petList
        .filter((pet: Pet) => pet.geofence)
        .map(
            (pet: Pet) => {
                return (
                    <Polygon positions={pet.geofence} />
                    )
            }
        )

    // When the map gets destroyed, it will remove every event listener. Previously the listener crashes the program
    // when the event is triggered but the page has been changed
    useEffect(() => {
        return () => {
            if (map !== null) {
                map.removeEventListener()
            }
        }
    }, [map])

    // React Hook when the petlist, map, or heatlayer gets changed
    // This will recalculate the heatlayer and apply it to the map & also adjust the center
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

        // Make sure nothing is null else it crash
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

            heatLayer.setLatLngs(petCoordinate)
        }
    }, [props.petList, map, heatLayer])

    // When the center is changed, re-centers the map
    useEffect(() => {
        if (map !== null && isMapVisible(map)) {
            map.setView([center.lat, center.lng], map.getZoom())
        }
    }, [center])

    return (
        <div style={{width:'100%', position: 'relative'}}>
            {/* Displays the Edit, Clear, and Delete button for Geofence editing */}
            {props.singlePetMode ? (
                <div className="mapButtonGroup">
                    {editing ? (<Button variant="danger" onClick={() => {
                        mutableGeofence = [...props.petList[0].geofence]
                        setGeofence([...mutableGeofence])
                        setGeofenceWidget(GeofenceEditor(mutableGeofence, setGeofence, !editing))
                        setEditing(!editing)
                    }}>
                        Cancel
                    </Button>) : null}{' '}
                    {editing ? (<Button variant="danger" onClick={() => {
                        mutableGeofence = []
                        setGeofence([...mutableGeofence])
                        setGeofenceWidget(GeofenceEditor(mutableGeofence, setGeofence, editing))
                    }}>
                        Clear
                    </Button>) : null}{' '}
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
                    </Button>
                </div>
            ) : null}
            <div>
                <MapContainer
                    whenCreated={map => {
                        /* When the map is created, set the Map so we can mutate it later*/

                        setMap(map)

                        // Check to see if the user has change page
                        if (isMapVisible(map)) {
                            // @ts-ignore
                            let heat = L.heatLayer([], heatLayerOptions).addTo(map)
                            setHeatLayer(heat)

                            map.setView([center.lat, center.lng], map.getZoom())
                        }

                        // This is to fix a bug on render & the map is set to 0. Since our map is flexible size,
                        // We recalculate the size once the map is created
                        setTimeout(() => {
                            if (isMapVisible(map)) {
                                map.invalidateSize()
                            }
                        }, 300)

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