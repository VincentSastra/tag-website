import React, {useEffect, useRef, useState} from "react";
import './page.css';
import '../components/widget/Maps.css'
import {MapWidget} from "../components/widget/Maps";
import {Card, CardDeck, Col, Container, Row, Spinner} from "react-bootstrap";
import {FlipCard} from "../components/widget/FlipCard";
import {getPets} from "../api/api";

const username = "Andrew"

const petList = [
    {
        name: "Oreo",
        img: "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    }, {
        name: "Popi",
        img: "https://dogtime.com/assets/uploads/2011/03/puppy-development-1280x720.jpg"
    }, {
        name: "Kucing",
        img: "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
    }, {
        name: "Eva",
        img: "https://img.huffingtonpost.com/asset/562e6c0f1400002b003c9220.jpeg?cache=yifce0exsu&ops=1778_1000"
    }
]

function PetCard(name: string, img: string): JSX.Element {
    return FlipCard(
        (<div className="fillDiv">
            <Card className="fillDiv">
                <Card.Img className="PetImage" variant="top" src={img} />
                <Card.Title className="PetTitle">
                    {name}
                </Card.Title>
            </Card>
        </div>),
        (<Card className="fillDiv">
                    <Card.Title className="PetTitle">
                        Data
                    </Card.Title>
                    <Card.Body>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                        <p>a</p>
                    </Card.Body>
                </Card>)
    )
}

function PetCardList(petList: Array<{name: string, img: string}>): Array<JSX.Element> {

    let columnWidth: number = Math.trunc(window.innerWidth / 100)
    let numCol: number = 1

    return petList.map(
        value => {
            return numCol % columnWidth === 0 ? (
                <Row key={"Row " + numCol / columnWidth}>
                    <Col key={value.name}>
                        {PetCard(value.name, value.img)}
                    </Col>
                </Row>
            ) : (
                <Col key={value.name}>
                    {PetCard(value.name, value.img)}
                </Col>
            )
        }
    )
}

export function HomePage(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false)

    getPets("shiehand")
        .then((res) => setLoading(true))

    return loading ? (
    <Container>
      <Row>
        <h1 className="PageTitle">{"Welcome " + username}</h1>
      </Row>
      <Row>
        <Card className="leaflet-container">
          <Card.Body style={{padding: 0}}>
            <MapWidget />
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <CardDeck>
          {PetCardList(petList)}
        </CardDeck>
      </Row>
    </Container>
  ) : (
      <Spinner animation={"border"} />
    )
}
