import React, {useEffect, useState} from "react";
import {Card, CardDeck, Col, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";
import {Pet, SensorData} from "../api/pet";
import { useHistory } from "react-router-dom";
import ActivityDoughnut from "../components/widget/ActivityDoughnut";
import {Auth} from "aws-amplify";

export function PetsPage(): JSX.Element {
    const history = useHistory()

    // @ts-ignore
    if (history.location.state.pet === null) {
        history.goBack()
    }

    // @ts-ignore
    const pet: Pet = history.location.state.pet

    const [petState, setPetState] = useState(pet)

    const activityList: string[] = []
    const activityCount: number[] = []

    let totalActivity: number = 0;

    useEffect(() => {
        Auth.currentUserInfo()
            .then(val => {
                const websocket = new WebSocket("wss://ivrpe7bcyl.execute-api.us-west-2.amazonaws.com/dev?username=" + val.username);
                websocket.addEventListener('message', (message) => {
                    let data = JSON.parse(message.data.toString())
                    if (data.type === "newData") {
                        if (pet.tagId === data.body.tagId.S) {
                            console.log(data)
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
                            setPetState(JSON.parse(JSON.stringify(pet)))
                        }
                    }
                })
            })
            .catch(err => {

            })
    }, [])

    petState.sensorData?.forEach(
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
        <Container>
          <Row style={{marginTop: "0"}}>
            <img style={{ maxHeight: "30vw" }} src={petState.img} alt={"Image of " + petState.name} />
          </Row>
          <Row>
            <h1 className="PageTitle">{petState.name}</h1>
          </Row>
          <Row>
            <MapWidget petList={[petState]} singlePetMode={true} />
          </Row>
            <Row>
                <Card style={{ width: '80%' }}>
                    <Card.Title>Activity in Last 24 Hour</Card.Title>
                    <Card.Body>
                        {ActivityDoughnut(activityList, activityCount)}
                    </Card.Body>
                </Card>
            </Row>
            <Row>
              <Card style={{ width: '80%' }}>
                <Card.Title>
                    Heart rate
                </Card.Title>
                <Card.Body>
                    { // @ts-ignore
                        Chart(petState.sensorData.map(
                            (data) => {
                            return { x: data.time, y: data.heartRate }
                    }
                        ), 'rgb(255, 99, 132)', 'rgba(255, 99, 132, 0.2)')}
                </Card.Body>
              </Card>
            </Row>
            <Row>
              <Card style={{ width: '80%' }}>
                <Card.Title>
                  Temperature
                </Card.Title>
                  <Card.Body>
                    { // @ts-ignore
                        Chart(petState.sensorData.map(
                             (data) => {
                                return { x: data.time, y: data.temperature }
                                }
                        ), 'rgb(54, 162, 235)', 'rgba(54, 162, 235, 0.2)')}

                    </Card.Body>
                </Card>
            </Row>
        </Container>
  )
}