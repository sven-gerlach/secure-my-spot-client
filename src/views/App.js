// import library modules
import React, { Component } from "react";
import {
  Switch,
  Route,
} from "react-router-dom";

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
} from "../utils/sessionStorage/sessionStorage";

/** class encompassing all views
 * */
class App extends Component {
  constructor(props) {
    super(props);
    // set user state to user from session storage or, failing that, to empty string
    this.state = {
      "user": getUserFromSessionStorage() || ""
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
    console.log(this.state)
    return (
      <AppBackground>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/create-account">
            <SignUp />
          </Route>
          <Route path="/sign-in">
            <SignIn setUser={this.setUser} />
          </Route>
          <Route path="/test">
            <AuthenticatedRoute user={this.state.user} />
          </Route>
        </Switch>
      </AppBackground>
    )
  }
}

export default App;
