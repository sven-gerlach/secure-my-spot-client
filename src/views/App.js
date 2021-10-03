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

// import styled components
import { AppBackground } from "./app.styles";

/** class encompassing all views
 * */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "user": null
    }
  }

  componentDidMount() {
    // attempt to retrieve any available user state from session storage
    try {
      const serializedUser = sessionStorage.getItem("user")
      if (serializedUser === null) {
        return undefined
      }
      const user = JSON.parse(serializedUser)
      this.setState({
        "user": user
      })
    } catch (e) {
      console.log(e)
    }
  }

  setUser = (user) => {
    this.setState({
      "user": user
    }, () => {
      try {
        //  update session storage with current state to make token persistent beyond session
        //  serialize state
        const serializedUser = JSON.stringify(this.state.user)
        //  todo: encrypt the serialized user object
        sessionStorage.setItem("user", serializedUser)
      } catch (e) {
        console.log(e)
      }
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
        </Switch>
      </AppBackground>
    )
  }
}

export default App;
