import React, { Component } from "react";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";
import { P } from "./landingPage.styles"
import { Button } from "react-bootstrap";
import { testGetMethod, testPatchMethod } from "../../httpRequests/reservation";


/** Class representing the landing page view
 */
class LandingPage extends Component {
  render() {
    return (
      <>
        <PageTitle titleText="[Landing Page]" />
        <P>We offer a convenient way to locate, reserve, and pay for on-street parking in New York.</P>
      </>
    )
  }
}

export default LandingPage
