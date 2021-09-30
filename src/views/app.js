import React, { Component } from "react";
import LandingPage from "./LandingPage/LandingPage";

// import styled components
import { AppBackground } from "./app.styles";

class App extends Component {
  render() {
    return (
      <AppBackground>
        <LandingPage />
      </AppBackground>
    )
  }
}

export default App;
