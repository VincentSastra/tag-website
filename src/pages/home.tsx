import React from "react";
import './page.css';
import '../components/widget/Maps.css'
import {MapWidget} from "../components/widget/Maps";
import {Card, CardDeck, Container, Row} from "react-bootstrap";

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

function PetCardList(petList: Array<{name: string, img: string}>): Array<JSX.Element> {
    return petList.map(
        value => {
            return (
              <Card>
                <Card.Img className="PetImage" variant="top" src={value.img} />
                <Card.Title className="PetTitle">
                  {value.name}
                </Card.Title>
              </Card>
            )
        }
    )
}

export function HomePage(): JSX.Element {
  return (
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
  )
}
