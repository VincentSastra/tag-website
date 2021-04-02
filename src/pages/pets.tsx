import React from "react";
import {Card, CardDeck, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";
import {Pet} from "../api/pet";
import { useHistory } from "react-router-dom";
import ActivityDoughnut from "../components/widget/ActivityDoughnut";

export function PetsPage(): JSX.Element {
    const history = useHistory()

    // @ts-ignore
    if (history.location.state.pet === null) {
        history.goBack()
    }

    // @ts-ignore
    const pet: Pet = history.location.state.pet

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
        <Container>
          <Row style={{marginTop: "0"}}>
            <img src={pet.img} alt={"Image of " + pet.name} />
          </Row>
          <Row>
            <h1 className="PageTitle">{pet.name}</h1>
          </Row>
          <Row>
            <MapWidget petList={[pet]} />
          </Row>
          <Row>
            <CardDeck>
              <Card>
                <Card.Title>
                    Heart rate
                </Card.Title>
                <Card.Body>
                    { // @ts-ignore
                        Chart(pet.sensorData.map(
                            (data) => {
                            return { x: data.time, y: data.heartRate }
                    }
                    ))}
                </Card.Body>
              </Card>
              <Card>
                <Card.Title>Activity in Last 24 Hour</Card.Title>
                <Card.Body>
                    {ActivityDoughnut(activityList, activityCount)}
                </Card.Body>
              </Card>
            </CardDeck>
          </Row>
        </Container>
  )
}