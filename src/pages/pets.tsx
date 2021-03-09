import React from "react";
import {Card, CardDeck, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";

export function PetsPage(): JSX.Element {
  return (
    <Container>
      <Row>
        <MapWidget />
      </Row>
      <Row>
        <CardDeck>
          <Card style={{width: "0.3vw", height: "0.1vh"}}>
            <Chart />
          </Card>
        </CardDeck>
      </Row>
    </Container>
  )
}