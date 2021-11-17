import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import components
import PageTitle from "../../../../components/pageTitle/PageTitle";
import { Button, Modal } from "react-bootstrap";

// import utils
import {
  createReservationUnauthUser,
  createReservationAuthUser
} from "../../../../httpRequests/reservation";

// import interfaces
import { IReservation } from "../../../../types";

interface IProps {
  reservationLength: string,
  parkingSpotId: string,
  user: { email: string, token: string },
  setReservation(reservation: object): void,
  clearSetAvailableParkingSpotsInterval(): void,
  reservation: IReservation,
}

interface IState {
  email: string,
  showSuccessModal: boolean,
  showFailureModal: boolean,
  paymentErrorMessage: string,
}


class Payment extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props)
    this.state = {
      email: "",
      showSuccessModal: false,
      showFailureModal: false,
      paymentErrorMessage: "",
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
    createReservationUnauthUser(this.props.parkingSpotId, data)
      .then((res: { data: object; }) => {
        // call setReservation in App view, which stores reservation in App state and stores it in local storage
        this.props.setReservation(res.data)
        // reset the email field
        this.setState({ email: "" })
        // show successful payment modal
        this.setState({showSuccessModal: true})
      })
      .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
        this.setState({
          paymentErrorMessage: e.response.data["email"][0]
        }, () => {
          // display the payment failure modal
          this.toggleFailureModal()
          // reset the email field
          this.setState({ email: "" })
        })
      })
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
    createReservationAuthUser(this.props.parkingSpotId, this.props.user.token, data)
      .then((res: { data: object; }) => {
        // call setReservation in App view, which stores reservation in App state and stores it in local storage
        this.props.setReservation(res.data)
        // show successful payment modal
        this.setState({showSuccessModal: true})
      })
      .catch((e: { response: { data: { [x: string]: any[]; }; }; }) => {
        this.setState({
          paymentErrorMessage: e.response.data["email"][0]
        }, () => {
          // display the payment failure modal
          this.toggleFailureModal()
        })
      })
  }

  toggleSuccessModal = () => {
    this.setState( state => {
      return {showSuccessModal: !state.showSuccessModal}
    })
  }

  toggleFailureModal = () => {
    this.setState( state => {
      return {showFailureModal: !state.showFailureModal}
    })
  }

  render() {
    const { reservation, user } = this.props
    const { paymentErrorMessage } = this.state

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

    // this JSX element drives the body content of the payment success modal
    let paymentSuccessModalBodyJSX
    if (reservation) {
      paymentSuccessModalBodyJSX = (
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
      paymentSuccessModalBodyJSX = <p>Please wait...</p>
    }

    // this JSX element contains the body content for the payment failure modal
    let paymentFailureModalBodyJSX
    if (paymentErrorMessage) {
      paymentFailureModalBodyJSX = <p>{paymentErrorMessage}</p>
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
          show={this.state.showSuccessModal}
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
            {paymentSuccessModalBodyJSX}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.toggleSuccessModal}>
              My Reservations
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payment Failure Modal: displays the reason why the payment did not succeed */}
        <Modal
          show={this.state.showFailureModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Oops...Something Went Wrong!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {paymentFailureModalBodyJSX}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.toggleFailureModal}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default Payment
