import React, { Component } from "react";
import Button from "../../components/button/Button";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";
import { P } from "./landingPage.styles"


/** Class representing the landing page view
 */
class LandingPage extends Component {
  render() {
    return (
      <>
        <PageTitle titleText="Secure-My-Spot" />
        <P>We offer a convenient way to locate, reserve, and pay for on-street parking in New York.</P>
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
