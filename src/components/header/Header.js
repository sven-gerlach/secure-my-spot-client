import React, { Component } from "react";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";


class Header extends Component {
  render() {
    // header for unauthenticated users
    const unauthenticatedHeaderJsx = (
      <>
        {/* change all Nav.Link components to react-router Link components to avoid a page reload upon clicking the
        clink */}
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <NavDropdown title="Account" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/create-account">Create Account</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/sign-in">Sign-In</NavDropdown.Item>
        </NavDropdown>
      </>
    )

    // header for authenticated users
    const authenticatedHeaderJsx = (
      <>
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/reserve">Reserve</Nav.Link>
        <Nav.Link as={Link} to="/reservations">My Reservations</Nav.Link>
        <NavDropdown title="Account" id="basic-nav-dropdown">
          <NavDropdown.Item as={Link} to="/my-detail">My Detail</NavDropdown.Item>
          <NavDropdown.Item as={Link} to="/change-password">Change Password</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/">Sign-Out</NavDropdown.Item>
        </NavDropdown>
      </>
    )

    // header used in render method is subject to whether or note the user is signed in, that is whether the user is
    // set in state
    const headerJsx = this.props.user
      ? authenticatedHeaderJsx
      : unauthenticatedHeaderJsx

    return (
      <>
        <Navbar bg="light" expand="lg" collapseOnSelect="true" fixed>
          <Container>
            <Navbar.Brand>Secure-My-Spot</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                {headerJsx}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </>
    )
  }
}

Header.displayName = "Navbar"

export default Header
