// import library modules
import React, { Component } from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

// import views
import LandingPage from "./landingPage/LandingPage";
import CreateAccount from "./landingPage/createAccount/CreateAccount";
import SignIn from "./landingPage/signIn/SignIn";

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
