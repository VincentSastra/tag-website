import React from "react";
import {Card, CardDeck, Container, Row} from "react-bootstrap";
import {MapWidget} from "../components/widget/Maps";
import Chart from "../components/widget/Chart";

export function PetsPage(): JSX.Element {
  return (
    <Container>
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