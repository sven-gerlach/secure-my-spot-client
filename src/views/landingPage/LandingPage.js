import React, { Component } from "react";

// import containers
import PageTitle from "../../components/pageTitle/PageTitle";
import {
  P,
  Div
} from "./landingPage.styles"

/** Class representing the landing page view
 */
class LandingPage extends Component {
  render() {
    return (
      <>
        <PageTitle titleText="Our Service" />
        <Div>
          <P>We offer a convenient way for you to locate, reserve, and pay for on-street parking in New York City.</P>
          <P>You can use our service without having to create an account. Should you wish to become a recurring customer we recommend creating an account as that will make your reservation and payment experience a little more convenient.</P>
        </Div>
      </>
    )
  }
}

export default LandingPage
