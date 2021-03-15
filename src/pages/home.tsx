import React, {useEffect, useState} from "react";
import './page.css';
import '../components/widget/Maps.css'
import {MapWidget} from "../components/widget/Maps";
import {Card, CardDeck, Col, Container, Row, Spinner} from "react-bootstrap";
import {FlipCard} from "../components/widget/FlipCard";
import {getPets, getSensorData} from "../api/api";
import {Pet} from "../api/pet";
import { useHistory } from "react-router-dom";

const username = "Andrew"

function PetCard(pet: Pet): JSX.Element {
    const history = useHistory()
    return (
        <div onClick={() => {
            history.push('/pets', {
                pet: pet
            })
        }} >
            {FlipCard(
                (<div className="fillDiv">
                    <Card className="fillDiv">
                        <Card.Img className="PetImage" variant="top" src={pet.img} />
                        <Card.Title className="PetTitle">
                            {pet.name}
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
            )}
        </div>
    )
}

function PetCardList(petList: Array<Pet>): Array<JSX.Element> {

    let columnWidth: number = Math.trunc(window.innerWidth / 100)
    let numCol: number = 1

    return petList.map(
        value => {
            return numCol % columnWidth === 0 ? (
                <Row key={"Row " + numCol / columnWidth}>
                    <Col key={value.name}>
                        {PetCard(value)}
                    </Col>
                </Row>
            ) : (
                <Col key={value.name}>
                    {PetCard(value)}
                </Col>
            )
        }
    )
}

export function HomePage(): JSX.Element {
    const [loading, setLoading] = useState<boolean>(true)
    const [petList, setPetList] = useState<Array<Pet>>([])

    // Call this once in instantiation
    useEffect(() => {
        getPets("shiehand")
            .then((res) => {
                // Once the pet is all fetched, show the page
                setLoading(false)

                res.forEach(
                    pet => {
                        // Get the sensor data of each pet to show on the map
                        // Then refresh the datastructure
                        getSensorData(pet.tagId)
                            .then(
                                petData => {
                                    pet.sensorData = petData
                                    setPetList(petList => [...petList, pet])
                                }
                            )
                    }
                )
            })
    }, []);

    return loading ? (
        <Spinner animation={"border"} />
    ) : (
        <Container>
            <Row>
                <h1 className="PageTitle">{"Welcome " + username}</h1>
            </Row>
            <Row>
                <Card className="leaflet-container">
                    <Card.Body style={{padding: 0}}>
                        <MapWidget petList={petList} />
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
