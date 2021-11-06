import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import utils
import {
  createParkingSpotReservationUnauthUser,
  createParkingSpotReservationAuthUser
} from "../../../../httpRequests/parkingSpots";
import PageTitle from "../../../../components/pageTitle/PageTitle";
import { storeObjectInStorage } from "../../../../utils/storage";

interface IProps {
  reservationLength: string,
  parkingSpotId: string,
  user: { email: string, token: string },
  setReservation(reservation: object): void
}

interface IState {
  email: string
}


class Payment extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props)
    this.state = {
      email: ""
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState({ email: value })
  }

  handlePaymentUnauthUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // construct data sent to API
    const data = {
      "reservation": {
        "email": this.state.email,
        "reservation_length": this.props.reservationLength
      }
    }

    // send http post request to api to create a new reservation resource
    createParkingSpotReservationUnauthUser(this.props.parkingSpotId, data)
      .then(res => {
        // set reservation state in App view
        console.log(res.data)
        this.props.setReservation(res.data)

        // forward user to the my reservations view
        this.props.history.push("/reservations")
      })
      .catch(e => console.log(e))
  }

  handlePaymentAuthUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data = {
      "reservation": {
        "reservation_length": this.props.reservationLength
      }
    }

    // send http post request to create new reservation resource
    createParkingSpotReservationAuthUser(this.props.parkingSpotId, this.props.user.token, data)
      .then(res => {
        // forward user to my reservations view where authenticated API request needs to retrieve and display all
        // current and past reservations
        this.props.history.push("/reservations")
      })
      .catch(e => console.log(e))
  }

  render() {
    let inputJSX = <></>
    if (!this.props.user) {
      inputJSX = (
        <input
          value={this.state.email}
          onChange={this.handleChange}
          placeholder="e-Mail"
        />
      )
    }
    return (
      <>
        <PageTitle titleText="Payment Page" />
        {inputJSX}
        <button
          onClick={this.props.user ? this.handlePaymentAuthUser : this.handlePaymentUnauthUser}
        >Confirm Payment</button>
      </>
    )
  }
}

export default Payment
