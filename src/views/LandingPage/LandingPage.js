import React, { Component } from 'react';
import Button from '../../components/button/button';

// import assets
import companyLogo from '../../assets/img/car_grey.png'

// import styled containers
import Div from "./LandingPage.styles";

class LandingPage extends Component {
  render() {
    return (
      <>
        {/*<div>*/}
        {/*  <img src={companyLogo} />*/}
        {/*</div>*/}
        <div>
          <h1>Secure-My-Spot</h1>
          <Button text="Create Account" />
          <Button text="Sign In" />
        </div>
      </>
    )
  }
}

export default LandingPage
