// import library modules
import React, { Component } from "react";
import {
  Route,
} from "react-router-dom";
import { withRouter } from "react-router-dom";

// import views
import LandingPage from "./landingPage/LandingPage";
import SignUp from "./landingPage/signUp/signUp";
import SignIn from "./landingPage/signIn/SignIn";

// import components
import { AppBackground } from "./app.styles";
import AuthenticatedRoute from "../components/authenticatedRoute/authenticatedRoute";
import {
  getUserFromSessionStorage,
  storeUserInSessionStorage,
} from "../utils/sessionStorage";
import Navbar from "../components/navbar/navbar";

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
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/create-account">
          <SignUp />
        </Route>
        <Route path="/sign-in">
          <SignIn setUser={this.setUser} />
        </Route>
        <AuthenticatedRoute path="/app" user={this.state.user} render={() => (
          <Navbar item1="Sven" item2="Gerlach" />
          )} />
      </AppBackground>
    )
  }
}

export default withRouter(App);
