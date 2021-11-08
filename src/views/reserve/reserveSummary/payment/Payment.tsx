import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import components
import PageTitle from "../../../../components/pageTitle/PageTitle";
import { Button, Modal } from "react-bootstrap";

// import utils
import {
  createParkingSpotReservationUnauthUser,
  createParkingSpotReservationAuthUser
} from "../../../../httpRequests/parkingSpots";

// import interfaces
import { Ireservation } from "../../../../types";

interface IProps {
  reservationLength: string,
  parkingSpotId: string,
  user: { email: string, token: string },
  setReservation(reservation: object): void,
  clearSetAvailableParkingSpotsInterval(): void,
  reservation: Ireservation,
}

interface IState {
  email: string,
  showModal: boolean,
}


class Payment extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props)
    this.state = {
      email: "",
      showModal: false
    }
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    this.setState({ email: value })
  }

  handlePaymentUnauthUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // stop getting and setting available parking spots to prevent the reservation of a parking spot causing the
    // "unavailable parking-spot" modal to pop up
    this.props.clearSetAvailableParkingSpotsInterval()

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
        // call setReservation in App view, which stores reservation in App state and stores it in local storage
        this.props.setReservation(res.data)

        // show successful payment modal
        this.setState({showModal: true})
      })
      .catch(e => console.log(e))
  }

  handlePaymentAuthUser = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // stop getting and setting available parking spots to prevent the reservation of a parking spot causing the
    // "unavailable parking-spot" modal to pop up
    this.props.clearSetAvailableParkingSpotsInterval()

    const data = {
      "reservation": {
        "reservation_length": this.props.reservationLength
      }
    }

    // send http post request to create new reservation resource
    createParkingSpotReservationAuthUser(this.props.parkingSpotId, this.props.user.token, data)
      .then(res => {
        // show successful payment modal
        this.setState({showModal: true})
      })
      .catch(e => console.log(e))
  }

  toggleModal = () => {
    this.setState( state => {
      return {showModal: !state.showModal}
    })
  }

  render() {
    const { reservation, user } = this.props

    let inputJSX = <></>
    if (!user) {
      inputJSX = (
        <input
          value={this.state.email}
          onChange={this.handleChange}
          placeholder="e-Mail"
        />
      )
    }

    // this JSX element drives the body content of the reservation confirmation modal
    let reservationModalBodyJSX = <></>
    if (reservation) {
      reservationModalBodyJSX = (
        <>
          <p>
            Congratulations! Your reservation was successful. We have sent you an email with your reservation details,
            including the reservation ID. Please do make sure to check your spam folder if you have not received an
            email by now.
          </p>
          <p>
            {
              user
                ? ""
                : "Since you do not have an account with us, we encourage you take note of the reservation ID below."
            }
          </p>
          <hr/>
          <p>Reservation ID: {reservation.id}</p>
          <p>Parking Spot: {reservation.parking_spot}</p>
        </>
      )
    }
    else {
      reservationModalBodyJSX = <p>Please wait...</p>
    }

    return (
      <>
        <PageTitle titleText="Payment Page" />
        {inputJSX}
        <button
          onClick={this.props.user ? this.handlePaymentAuthUser : this.handlePaymentUnauthUser}
        >Confirm Payment</button>
        {/* Payment Success Modal: displays the reservation confirmation */}
        <Modal
          show={this.state.showModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
          /*redirect user to my reservations summary view */
          onExiting={() => this.props.history.push("/reservations")}
        >
          <Modal.Header>
            <Modal.Title>Booking Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {reservationModalBodyJSX}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.toggleModal}>
              My Reservations
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default Payment
