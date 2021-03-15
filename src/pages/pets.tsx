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
    console.log(pet)

    return (
        <Container>
          <Row>
              <MapWidget petList={[pet]} />
          </Row>
          <Row>
            <CardDeck>
              <Card style={{width: "1000px", height: "1000px"}}>
                <Chart />
              </Card>
            </CardDeck>
          </Row>
        </Container>
  )
}