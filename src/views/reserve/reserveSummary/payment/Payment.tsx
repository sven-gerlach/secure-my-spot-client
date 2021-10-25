import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import utils
import { createParkingSpotReservation } from "../../../../httpRequests/parkingSpots";
import CustomButton from "../../../../components/button/CustomButton";
import PageTitle from "../../../../components/pageTitle/PageTitle";

interface IProps {
  reservationLength: string,
  parkingSpotId: string
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

  handlePayment = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // construct data sent to API
    const data = {
      email: this.state.email,
      reservationLength: this.props.reservationLength
    }

    // send http post request to api to create a new reservation resource
    createParkingSpotReservation(this.props.parkingSpotId, data)
      .then(res => {
        // todo: implement logic once parking spot has been reserved
        // need to received a reservation ID
        // combination of email and reservation id should allow the user to amend the reservation under My Reservations
        console.log(res)
      })
      .catch(e => console.log(e))
  }

  render() {
    return (
      <>
        <PageTitle titleText="Payment Page" />
        <input
          value={this.state.email}
          onChange={this.handleChange}
          placeholder="e-Mail"
        />
        <button
          onClick={this.handlePayment}
        >Confirm Payment</button>
      </>
    )
  }
}

export default Payment
