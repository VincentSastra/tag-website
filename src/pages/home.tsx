import React, {useEffect, useState} from "react";
import './page.css';
import '../components/widget/Maps.css'
import {MapWidget} from "../components/widget/Maps";
import {Card, CardDeck, Col, Container, Row, Spinner, Table} from "react-bootstrap";
import {FlipCard} from "../components/widget/FlipCard";
import {getNotificationArray, getPets, getSensorData} from "../api/api";
import {Pet, SensorData} from "../api/pet";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import {messageBody, Notification} from "../components/widget/NotificationToast";
import ActivityDoughnut from "../components/widget/ActivityDoughnut";

/* Home landing page */
function PetCard(pet: Pet): JSX.Element {
    const history = useHistory()

    const activityList: string[] = []
    const activityCount: number[] = []

    let totalActivity: number = 0;

    /* Used for activity doughnut on the flipcard */
    pet.sensorData?.forEach(
        data => {
            if (!activityList.includes(data.activity)) {
                activityList.push(data.activity)
                activityCount[activityList.indexOf(data.activity)] = 0
            }
            activityCount[activityList.indexOf(data.activity)]++
            totalActivity++
        }
    )

    activityCount.forEach((val, index) => {
            activityCount[index] = val / totalActivity
        }
    )

    return (
        <div onClick={() => {
            history.push('/pets', {
                pet: pet
            })
        }} >
            {FlipCard(
                (<div className="fillDiv">
                    <Card className="fillDiv">
                        <Card.Img className="PetImage" variant="top" src={pet.img} />
                        <Card.Title className="PetTitle">
                            {pet.name}
                        </Card.Title>
                    </Card>
                </div>),
                (<Card style={{ margin: "0", height: "100%" }}>
                    <Card.Title>Activity in Last 24 Hour</Card.Title>
                    <Card.Body>
                        {ActivityDoughnut(activityList, activityCount)}
                    </Card.Body>
                </Card>)
            )}
        </div>
    )
}

/* Pipeline to turn the pet array into JSX Element array */
function PetCardList(petList: Array<Pet>): Array<JSX.Element> {

    let columnWidth: number = Math.trunc(window.innerWidth / 100)
    let numCol: number = 1

    return petList.map(
        value => {
            return numCol % columnWidth === 0 ? (
                <Row key={"Row " + numCol / columnWidth}>
                    <Col key={value.name + value.tagId}>
                        {PetCard(value)}
                    </Col>
                </Row>
            ) : (
                <Col key={value.name + value.tagId}>
                    {PetCard(value)}
                </Col>
            )
        }
    )
}

export function HomePage(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true)
    const [petList, setPetList] = useState<Array<Pet>>([])

    const mutablePetList: Array<Pet> = []

    const [username, setUsername] = useState("")

    const [notificationArray, setNotificationArray] = useState<Array<Notification>>([])

    // Call this once in instantiation
    useEffect(() => {
        // Create the websocket for new data
        Auth.currentUserInfo()
            .then(val => {
                setUsername(val.username)

                const websocket = new WebSocket("wss://ivrpe7bcyl.execute-api.us-west-2.amazonaws.com/dev?username=" + val.username);
                websocket.addEventListener('message', (message) => {
                    let data = JSON.parse(message.data.toString())
                    if (data.type === "newData") {
                        mutablePetList.forEach(pet => {
                            if (pet.tagId === data.body.tagId.S) {
                                pet.sensorData?.forEach(
                                    sensorData => {
                                        if (sensorData.time === parseInt(data.body.time.N)) {
                                            return
                                        }
                                    }
                                )
                                // Modify the pet sensor data if new array is for them
                                pet.sensorData?.shift()
                                pet.sensorData?.push({
                                    time: parseInt(data.body.time.N),
                                    heartRate: parseInt(data.body.heartRate.N),
                                    latitude: parseFloat(data.body.latitude.N),
                                    longitude: parseFloat(data.body.longitude.N),
                                    activity: data.body.activity.S,
                                    temperature: parseInt(data.body.temperature.N)
                                })
                                pet.sensorData?.sort(function(a, b){return b.time - a.time});
                                setPetList([...mutablePetList])
                            }
                        })
                    }
                })
            })
            .catch(err => {

            })

        // Get the Notification Array from our API
        getNotificationArray()
            .then((val: Array<Notification>) => {
                setNotificationArray(val)
            })

        // Get the pets from our API
        getPets()
            .then((res) => {
                // Once the pet is all fetched, show the page
                setLoading(false)
                res.forEach(
                    pet => {
                        // Get the sensor data of each pet to show on the map
                        // Then refresh the datastructure
                        getSensorData(pet.tagId)
                            .then(
                                petData => {
                                    pet.sensorData = petData
                                    mutablePetList.push(pet)
                                    setPetList([...mutablePetList])
                                }
                            )
                    }
                )
            })
    }, []);

    // Return a spinner animation while API is fetching
    return loading ? (
        <Spinner animation={"border"} />
    ) : (
        <Container>
            {/* Title */}
            <Row>
                <h1 className="PageTitle">{"Welcome " + username}</h1>
            </Row>
            {/* Map with all the pets */}
            <Row>
                <Card className="leaflet-container">
                    <Card.Body style={{padding: 0}}>
                        <MapWidget petList={petList} singlePetMode={false} />
                    </Card.Body>
                </Card>
            </Row>
            {/* Card deck with all the pets */}
            <Row>
                <CardDeck>
                    {PetCardList(petList)}
                </CardDeck>
            </Row>
            {/* Table for the notification */}
            <Row>
                {notificationArray.length > 0 ?
                        (
                            <Table bordered hover>
                                <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                </tr>
                                </thead>
                                <tbody style={{ fontWeight: "normal" }}>
                                {notificationArray.map(val => {
                                    return (
                                        <tr>
                                            <td>{(new Date(val.time * 1000)).toLocaleString()}</td>
                                            <td>{val.header}</td>
                                            <td>{messageBody(val)}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        ) : null}
            </Row>
        </Container>
    )
}
