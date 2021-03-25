import React from "react";
import {Card, CardDeck, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";
import {Pet} from "../api/pet";
import { useHistory } from "react-router-dom";

export function PetsPage(): JSX.Element {
    const history = useHistory()

    // @ts-ignore
    if (history.location.state.pet === null) {
        history.goBack()
    }

    // @ts-ignore
    const pet: Pet = history.location.state.pet

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
              <Card >
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

              </Card>
            </CardDeck>
          </Row>
        </Container>
  )
}