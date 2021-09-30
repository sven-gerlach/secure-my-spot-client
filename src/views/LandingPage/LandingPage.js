import React, { Component } from "react";
import Button from "../../components/button/button";

// import assets

// import styled containers
import { H1 } from "./LandingPage.styles";

class LandingPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <H1>Secure-My-Spot</H1>
        <Button
          buttonText="Create Account"
          urlTarget="/create-account"
        />
        <Button
          buttonText="Sign In"
          urlTarget="/sign-in"
        />
      </>
    )
  }
}

export default LandingPage
