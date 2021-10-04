// import library modules
import React, { Component } from "react";
import {
  Route
} from "react-router-dom";
import { withRouter } from "react-router-dom";

// import views
import LandingPage from "./landingPage/LandingPage";
import SignUp from "./landingPage/signUp/signUp";
import SignIn from "./landingPage/signIn/SignIn";

// import components
import { AppBackground } from "./app.styles";
import Header from "../components/header/Header";

// Import utility functions
import {
  getUserFromSessionStorage,
  storeUserInSessionStorage,
} from "../utils/sessionStorage";


/** class encompassing all views
 * */
class App extends Component {
  constructor(props) {
    super(props);
    // set user state to user from session storage or, failing that, to null
    this.state = {
      "user": getUserFromSessionStorage() || null
    }
  }

  setUser = (user) => {
    this.setState({
      "user": user
    }, () => {
      storeUserInSessionStorage(this.state.user)
    })
  }

  render() {
    return (
      <AppBackground>
        <Header user={this.state.user} />
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/create-account">
          <SignUp />
        </Route>
        <Route path="/sign-in">
          <SignIn setUser={this.setUser} />
        </Route>
      </AppBackground>
    )
  }
}

export default withRouter(App);
