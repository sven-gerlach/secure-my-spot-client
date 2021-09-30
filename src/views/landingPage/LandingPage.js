import React, { Component } from "react";
import Button from "../../components/button/Button";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";

class LandingPage extends Component {

  render() {
    return (
      <>
        <PageTitle titleText="Secure-My-Spot" />
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
