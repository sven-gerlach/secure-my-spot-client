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
import ReservationsView from "./reservations/reservations";

// import components
import Header from "../components/header/Header";

// Import utility functions
import {
  getObjectFromStorage,
  storeObjectInStorage,
  removeObjectFromStorage,
} from "../utils/storage";

// import styles
import Div from "./app.styles"


/** class encompassing all views
 * */
class App extends Component {
  constructor(props) {
    super(props);
    // set user state to user from session storage or, failing that, to null
    this.reservationTimeOutQueue = []
    this.state = {
      user: getObjectFromStorage("user", "local") || null,
      alertQueue: [],
      reservation: getObjectFromStorage("reservation", "local") || null,
    }
    this.headerRef = React.createRef()
  }

  componentDidMount() {
    // if reservation is not null, set a timeout and enqueue it
    if (this.state.reservation) {
      // create timeout to remove reservation from local storage
      const now = Date.now()
      const end_time = Date.parse(this.state.reservation.end_time)
      const delay = end_time - now

      // set timeout
      const timeoutID = setTimeout(() => {
        this.setReservation(null)
      }, delay)

      // enqueue timeoutID
      this.reservationTimeOutQueue.push(timeoutID)
    }
  }

  componentWillUnmount() {
    // dequeue any remaining timeouts from reservationTimeOutQueue and clear timeout
    while (this.reservationTimeOutQueue.length > 0) {
      clearTimeout(this.reservationTimeOutQueue.shift())
    }
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
        : removeObjectFromStorage("user", "local")
    })
  }

  setReservation = (reservation) => {
    this.setState({
      "reservation": reservation
    }, () => {
      // if reservation state is not null, that is a new reservation was made or an old one updated
      if (this.state.reservation) {
        // add or update reservation to local storage
        storeObjectInStorage(this.state.reservation, "reservation", "local")

        // check if reservationTimeoutQueue has an entry, dequeue it, and clear timeout
        if (this.reservationTimeOutQueue.length !== 0) {
          let timeoutID = this.reservationTimeOutQueue.shift()
          clearTimeout(timeoutID)
        }

        // create the delay time for the timeout
        const now = Date.now()
        const end_time = Date.parse(reservation.end_time)
        const delay = end_time - now

        // create timeout to remove reservation from local storage if, and only if, the delay is strictly positive
        let timeoutID
        if (delay > 0) {
          timeoutID = setTimeout(() => {
            this.setReservation(null)
            // todo: add an alert or a modal that informs the user that the current reservation has expired
          }, delay)
        }

        // add timeoutID to reservationTimeoutQueue
        this.reservationTimeOutQueue.push(timeoutID)
      }
      else {
        // else, remove reservation from local storage
        removeObjectFromStorage("reservation", "local")

        // dequeue any remaining timeouts from reservationTimeOutQueue and clear timeout
        while (this.reservationTimeOutQueue.length > 0) {
          clearTimeout(this.reservationTimeOutQueue.shift())
        }
      }
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
            user={this.state.user}
            setReservation={this.setReservation}
            reservation={this.state.reservation}
          />
        )}/>

        {/* Reservation summary displays current and past reservations */}
        <Route path="/reservations" render={(props) => (
          <ReservationsView
            {...props}
            reservation={this.state.reservation}
            setReservation={this.setReservation}
            user={this.state.user}
          />
        )}/>
      </Div>
    )
  }
}

export default App;
