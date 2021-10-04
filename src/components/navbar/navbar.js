import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <>
        <h1>Navbar</h1>
        <p>{this.props.item1}</p>
        <p>{this.props.item2}</p>
      </>
    )
  }
}

Navbar.displayName = "Navbar"

export default Navbar
