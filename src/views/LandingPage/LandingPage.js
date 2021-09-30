import React, { Component } from 'react';
import Button from '../../components/button/button';

// import assets

// import styled containers
import { H1 } from "./LandingPage.styles";

class LandingPage extends Component {
  render() {
    return (
      <>
        {/*<div>*/}
        {/*  <img src={companyLogo} />*/}
        {/*</div>*/}
        <div>
          <H1>Secure-My-Spot</H1>
          <Button text="Create Account" />
          <Button text="Sign In" />
        </div>
      </>
    )
  }
}

export default LandingPage
