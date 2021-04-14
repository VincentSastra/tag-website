import React from "react";
import {Navbar, Nav} from "react-bootstrap";
import {Link} from "react-router-dom";

/* JSX element for the Navbar in top right. Also use react-router to be able to route pages */

export function TagNavbar (): JSX.Element {
    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to ="/">Animal Guardian</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/create-pet">Register Pets</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
}