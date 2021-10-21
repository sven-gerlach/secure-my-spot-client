import React, { Component } from "react";

// import styling elements
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";

// import utility functions
import { signOutRequest } from "../../httpRequests/auth";


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "expanded": false
    }
  }

  handleNavbarCollapse(event) {
    event.stopPropagation()
    if (event.target.id !== "basic-nav-dropdown") {
      this.setState({
        "expanded": !this.state.expanded
      })
    }
  }

  handleSignOut(event) {
    // call sign-out axios http request function
    signOutRequest(this.props.user.token)
      .then((event) => {
        // reset user state to null which then automatically deletes the hashed user object from local storage
        this.props.setUser(null)
        // redirect to landing page
        this.props.history.push("/")
      })
      .catch(console.error)
  }

  render() {
    const { user } = this.props

    // header for unauthenticated users
    const unauthenticatedHeaderJsx = (
      <>
        {/* change all Nav.Link components to react-router Link components to avoid a page reload upon clicking the
        clink */}
        <Nav.Link as={Link} to="/">Home</Nav.Link>
        <Nav.Link as={Link} to="/reserve">Reserve</Nav.Link>
        <Nav.Link as={Link} to="/reservations">My Reservations</Nav.Link>
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
          <NavDropdown.Item
            as={Link}
            to="/"
            onClick={(event) => this.handleSignOut(event)}>
            Sign-Out
          </NavDropdown.Item>
        </NavDropdown>
      </>
    )

    return (
      <>
        {/* collapseOnSelect=true is not possible since the Nav.Link have been replaced with RouterDom Link items which
        do not fire the closing signal. Hence, a manual implementation was necessary.*/}
        <Navbar bg="light" expand="lg" fixed="top" expanded={this.state.expanded}
        >
          <Container>
            <Navbar.Brand>Secure-My-Spot</Navbar.Brand>
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={(event) => this.handleNavbarCollapse(event)} />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto"
                   onClick={(event) => this.handleNavbarCollapse(event)}>
                {user && <span className="navbar-text mr-5">Welcome, {user.email}</span>}
                {user ? authenticatedHeaderJsx : unauthenticatedHeaderJsx}
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
