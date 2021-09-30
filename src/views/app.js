// import library modules
import React, { Component } from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

// import views
import LandingPage from "./LandingPage/LandingPage";
import CreateAccount from "./LandingPage/CreateAccount/CreateAccount";
import SignIn from "./LandingPage/SignIn/SignIn";

// import styled components
import { AppBackground } from "./app.styles";

class App extends Component {
  render() {
    return (
      <AppBackground>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/create-account">
            <CreateAccount />
          </Route>
          <Route path="/sign-in">
            <SignIn />
          </Route>
        </Switch>
      </AppBackground>
    )
  }
}

export default App;
