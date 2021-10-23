// import library modules
import React, { Component } from "react";
import {
  Route
} from "react-router-dom";
import { v4 as uuid } from "uuid";

// import views
import LandingPage from "./landingPage/LandingPage";
import SignUpView from "./signUp/SignUp";
import SignInView from "./signIn/SignIn";
import ReserveView from "./reserve/Reserve";
import CustomAlert from "./customAlert/CustomAlert";

// import components
import Header from "../components/header/Header";

// Import utility functions
import {
  getObjectFromStorage,
  storeObjectInStorage,
  removeObjectFromStorage,
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
      user: getObjectFromStorage("user", "local") || null,
      alertQueue: []
    }
    this.headerRef = React.createRef()
  }

  setUser = (user) => {
    this.setState({
      "user": user
    }, () => {
      this.state.user
        // add user to session storage if user object is not null
        ? storeObjectInStorage(this.state.user, "user", "local")
        // otherwise remove user from session storage -> log-out automatically leads to deletion of user object in
        // storage
        : removeObjectFromStorage("user")
    })
  }

  handleBackgroundClick(event) {
    // only if the current expanded state of Header is true, change the state to false
    event.stopPropagation()
    if (this.headerRef.current.state.expanded) {
      this.headerRef.current.handleNavbarCollapse(event)
    }
  }

  /**
   * Enqueues a new alert and returns undefined
   * @param {string} variant - type of button styling
   * @param {string} heading - heading text
   * @param {string} message - message text
   * @return
   */
  enqueueNewAlert = (variant, heading, message) => {
    const newAlert = {
      variant: variant,
      heading: heading,
      message: message,
      key: uuid()
    }
    this.setState(prevState => {
      return { alertQueue: [...prevState.alertQueue, newAlert] }
    })
  }

  /**
   *
   * @returns {Object} dequeuedAlert - returns the next alert to be displayed and removes it from the queue
   */
  dequeueAlert = () => {
    let dequeuedAlert
    this.setState(prevState => {
      dequeuedAlert = prevState.alertQueue.shift()
      return { alertQueue: [...prevState.alertQueue] }
    })
    return dequeuedAlert
  }

  render() {
    return (
      // this div captures any click events and closes the header if it was in an open state
      <Div onClick={(event) => this.handleBackgroundClick(event)}>

        {/* Custom alert depletes all alerts in the queue in order */}
        {this.state.alertQueue.map((alert) => {
          return (
            <CustomAlert
              key={alert.key}
              variant={alert.variant}
              heading={alert.heading}
              message={alert.message}
              dequeueAlert={this.dequeueAlert}
            />
          )
        })}

        {/* Header: wrapped inside a Route so that it has access to props.history. ref is used so that a click-event on
            the surface outside the header can effect the closing of the header */}
        <Route render={(props) => (
          <Header
            {...props}
            user={this.state.user}
            setUser={this.setUser}
            ref={this.headerRef}
          />
        )}/>

        {/* Landing page */}
        <Route exact path="/" render={() => <LandingPage enqueueNewAlert={this.enqueueNewAlert} />} />

        {/* Sign-up view */}
        <Route path="/create-account" render={(props) => (
          <SignUpView {...props} />
        )}/>

        {/* Sign-in view */}
        <Route path="/sign-in" render={(props) => (
          <SignInView
            {...props}
            setUser={this.setUser}
            enqueueNewAlert={this.enqueueNewAlert}
          />
        )}/>

        {/* Reserve view also comprises the map view and the reservation summary view */}
        <Route path="/reserve" render={(props) => (
          <ReserveView
            {...props}
            enqueueNewAlert={this.enqueueNewAlert}
          />
        )}/>
      </Div>
    )
  }
}

export default App;
