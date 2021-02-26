import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

export function TagNavbar (): JSX.Element {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to ="/">Animal Guardian</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/pets">Pets</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}