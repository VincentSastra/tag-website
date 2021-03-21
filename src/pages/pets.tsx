import React from "react";
import {Card, CardDeck, Col, Container, Row} from "react-bootstrap";
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
                    {Chart([React.useMemo(() => ({
                        label: "Heart rate",
                        // @ts-ignore
                        data: pet.sensorData.map((sensor) => {
                            return {
                                primary: sensor.time,
                                secondary: sensor.heartRate
                            }
                        })
                    }),
                    [pet])
                    ])}
                </Card.Body>
              </Card>
              <Card>

              </Card>
            </CardDeck>
          </Row>
        </Container>
  )
}