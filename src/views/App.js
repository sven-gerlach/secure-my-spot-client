// import library modules
import React, { Component } from "react";
import {
  Route
} from "react-router-dom";

// import views
import LandingPage from "./landingPage/LandingPage";
import SignUpView from "./signUp/SignUp";
import SignInView from "./signIn/SignIn";

// import components
import Header from "../components/header/Header";

// Import utility functions
import {
  getUserFromSessionStorage,
  storeUserInSessionStorage,
  removeFromSessionStorage,
} from "../utils/sessionStorage";

// import styles
import Div from "./app.styles"


/** class encompassing all views
 * */
class App extends Component {
  constructor(props) {
    super(props);
    // set user state to user from session storage or, failing that, to null
    this.state = {
      "user": getUserFromSessionStorage() || null
    }
    this.headerRef = React.createRef()
  }

  setUser = (user) => {
    this.setState({
      "user": user
    }, () => {
      this.state.user
        // add user to session storage if user object is not null
        ? storeUserInSessionStorage(this.state.user)
        // otherwise remove user from session storage
        : removeFromSessionStorage("user")
    })
  }

  handleBackgroundClick(event) {
    // only if the current expanded state of Header is true, change the state to false
    event.stopPropagation()
    if (this.headerRef.current.state.expanded) {
      this.headerRef.current.handleNavbarCollapse(event)
    }
  }

  render() {
    return (
      <Div onClick={(event) => this.handleBackgroundClick(event)}>
        {/* only reason Header is wrapped inside a Route is so that Header has access to props.history */}
        <Route render={(props) => (
          <Header
            {...props}
            user={this.state.user}
            setUser={this.setUser}
            ref={this.headerRef}
          />
        )}/>
        <Route exact path="/" >
          <LandingPage />
        </Route>
        <Route path="/create-account">
          <SignUpView />
        </Route>
        <Route path="/sign-in">
          <SignInView setUser={this.setUser} />
        </Route>
      </Div>
    )
  }
}

export default App;
