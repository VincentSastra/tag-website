import React from "react";
import {Card, CardDeck, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";
import {Pet} from "../api/pet";

export function PetsPage(pet: Pet): JSX.Element {
  return (
    <Container>
      <Row>
          {MapWidget([pet])}
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