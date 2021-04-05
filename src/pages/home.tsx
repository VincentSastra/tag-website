import React, {useEffect, useState} from "react";
import './page.css';
import '../components/widget/Maps.css'
import {MapWidget} from "../components/widget/Maps";
import {Card, CardDeck, Col, Container, Row, Spinner, Table} from "react-bootstrap";
import {FlipCard} from "../components/widget/FlipCard";
import {getNotificationArray, getPets, getSensorData} from "../api/api";
import {Pet} from "../api/pet";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";
import {messageBody, Notification} from "../components/widget/NotificationToast";
import ActivityDoughnut from "../components/widget/ActivityDoughnut";


function PetCard(pet: Pet): JSX.Element {
    const history = useHistory()

    const activityList: string[] = []
    const activityCount: number[] = []

    let totalActivity: number = 0;

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

    const [username, setUsername] = useState("")

    const [notificationArray, setNotificationArray] = useState<Array<Notification>>([])

    // Call this once in instantiation
    useEffect(() => {
        Auth.currentUserInfo()
            .then(val => {
                setUsername(val.username)
            })

        getNotificationArray()
            .then((val: Array<Notification>) => {
                console.log(val)
                setNotificationArray(val)
            })

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
                                    setPetList(petList => [...petList, pet])
                                }
                            )

                        const websocket = new WebSocket("wss://ivrpe7bcyl.execute-api.us-west-2.amazonaws.com/dev?tagId=" + pet.tagId)
                        websocket.onmessage = (message => {
                            console.log(message)
                            if (message.data.type === "newData") {
                                pet.sensorData?.shift()
                                pet.sensorData?.push({
                                    time: message.data.time,
                                    heartRate: message.data.heartRate,
                                    latitude: message.data.latitude,
                                    longitude: message.data.longitude,
                                    activity: message.data.activity,
                                    temperature: message.data.temperature
                                })
                                setPetList([...petList])
                            }
                        })
                    }
                )
            })
    }, []);

    return loading ? (
        <Spinner animation={"border"} />
    ) : (
        <Container>
            <Row>
                <h1 className="PageTitle">{"Welcome " + username}</h1>
            </Row>
            <Row>
                <Card className="leaflet-container">
                    <Card.Body style={{padding: 0}}>
                        <MapWidget petList={petList} singlePetMode={false} />
                    </Card.Body>
                </Card>
            </Row>
            <Row>
                <CardDeck>
                    {PetCardList(petList)}
                </CardDeck>
            </Row>
            <Row>
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
            </Row>
        </Container>
    )
}
