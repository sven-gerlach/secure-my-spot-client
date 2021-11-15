/**
 * Module for the My Reservations view.
 *
 * For the unauthenticated user this module reads the reservation key from local storage, provided there is one, and
 * displays the results on screen.
 *
 * For authenticated users this module makes an api request to retrieve all reservations, current and historic, to
 * display them.
 *
 * It also provides the option to amend any current reservations.
 */

// Import
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import custom components
import PageTitle from "../../components/pageTitle/PageTitle";
import CustomButton from "../../components/button/CustomButton";
import {
  Button,
  Modal,
  FloatingLabel,
  Form
} from "react-bootstrap";
import {
  getReservation,
  getActiveReservationsAuth,
  getExpiredReservationsAuth,
} from "../../httpRequests/reservation";
import Reservation from "./reservation/reservation";

// import interfaces
import { IReservation } from "../../types";


interface IProps {
  user?: { email: string, token: string },
  reservation: IReservation
  setReservation: (reservation: IReservation | null) => void
}

interface IState {
  reservations: IReservation[],
  showChangeEndTimeModal: boolean,
  showEndReservationModal: boolean,
  email: string,
  reservationID: string,
}

class ReservationsView extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      reservations: [],
      showChangeEndTimeModal: false,
      showEndReservationModal: false,
      email: "",
      reservationID: "",
    }
  }

  componentDidMount() {
    // if the user is authenticated, retrieve any active reservations from the api
    if (this.props.user && !this.props.reservation) {
      this.handleActiveReservationsAuth()
    }
  }

  /**
   * Make api call to change the end-time of a reservation
   * @param e
   */
  handleChangeEndTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("call change reservation API")
  }

  /**
   * Make a call to the api to end a reservation
   * @param e
   */
  handleEndReservation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("call end reservation API")
  }

  /**
   * Retrieve a reservation for an unauthenticated user, given the provided email and the reservationID
   * @param e
   */
  handleRetrieveReservationUnauth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // call API
    getReservation(this.state.reservationID, this.state.email)
      .then(res => {
        console.log(res)
        this.props.setReservation(res.data)
      })
      .catch(e => console.error(e))
  }

  handleInputValueChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const value = e.target.value
    this.setState({ [key]: value } as Pick<IState, "email" | "reservationID">)
  }

  /**
   * Display or hide the modal which allows a user to change the end-time of a specific reservation
   */
  toggleChangeEndTimeModal = () => {
    this.setState(prevState => {
      return { showChangeEndTimeModal: !prevState.showChangeEndTimeModal }
    })
  }

  /**
   * Display or hide the modal which allows a user to end a reservation before it expires automatically
   */
  toggleEndReservationModal = () => {
    this.setState(prevState => {
      return { showEndReservationModal: !prevState.showEndReservationModal }
    })
  }

  /**
   * Make api call to retrieve all active reservations for an authenticated user
   */
  handleActiveReservationsAuth = () => {
    if (this.props.user) {
      // set reservation in local storage to null
      this.props.setReservation(null)

      // retrieve active reservations from API
      getActiveReservationsAuth(this.props.user.token)
        .then(res => {
          this.setState({ reservations: res.data })
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  /**
   * Make apu call to retrieve all expired reservations for an authenticated user
   */
  handleExpiredReservationsAuth = () => {
    if (this.props.user) {
      getExpiredReservationsAuth(this.props.user.token)
        .then(res => {
          this.setState({ reservations: res.data })
        })
        .catch(e => {
          console.error(e)
        })
    }
  }

  render() {
    const { reservation, user } = this.props

    let reservationJSX: JSX.Element[] | JSX.Element = <></>
    let authUserButtonJSX: JSX.Element = <></>
    let unauthUserFormJSX: JSX.Element = <></>

    // if a reservation is stored in App state, display that reservation for authenticated and unauthenticated user
    if (reservation) {
      // display reservation details
      reservationJSX = (
        <>
          <Reservation
            reservation={reservation}
            toggleChangeEndTimeModal={this.toggleChangeEndTimeModal}
            toggleEndReservationModal={this.toggleEndReservationModal}
          />
        </>
      )
    }
    // if no reservation is stored in App state, display a message
    else {
      if (user) {
        if (this.state.reservations.length > 0) {
          reservationJSX = (
            this.state.reservations.map(reservation => (
              <Reservation
                key={reservation.id}
                reservation={reservation}
                toggleChangeEndTimeModal={this.toggleChangeEndTimeModal}
                toggleEndReservationModal={this.toggleEndReservationModal}
              />
            ))
          )
        }
        else {
          reservationJSX = <p>No reservations available...</p>
        }
      }
    }

    // if the user is authenticated, display two buttons that allow the user to retrieve any current and past
    // reservations
    if (user) {
      authUserButtonJSX = (
        <>
          <CustomButton
            buttonText="Active Reservations"
            handleSubmit={this.handleActiveReservationsAuth}
          />
          <CustomButton
            buttonText="Expired Reservations"
            handleSubmit={this.handleExpiredReservationsAuth}
          />
        </>
      )
    }
    // if the user is unauthenticated, display form field for email and reservationID that retrieves any reservation,
    // active or not, that matches the email and reservation id
    else {
      unauthUserFormJSX = (
        <>
          <h3>Search for {reservation ? "another" : "a"} reservation:</h3>
          <FloatingLabel
            controlId="floatingInput"
            label="e-Mail"
            className="mb-3"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="a"
              onChange={this.handleInputValueChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Reservation ID">
            <Form.Control
              type="text"
              placeholder="a"
              name="reservationID"
              onChange={this.handleInputValueChange}
            />
          </FloatingLabel>
          <Button variant="primary" type="submit" onClick={this.handleRetrieveReservationUnauth}>
            Find
          </Button>
        </>
      )
    }

    const changeEndTimeModalBodyJSX = (
      <>
        <p>[to come]</p>
      </>
    )

    const endReservationModalBodyJSX = (
      <>
        <p>[to come]</p>
      </>
    )

    return (
      <>
        <PageTitle titleText="My Reservations" />
        {/* todo: convert this into its own component */}
        {reservationJSX}
        {authUserButtonJSX}
        {unauthUserFormJSX}

        {/* todo: refactor -> create one modal component */}
        {/* Change end-time modal */}
        <Modal
          show={this.state.showChangeEndTimeModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Change Your Reservation End-Time</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {changeEndTimeModalBodyJSX}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={this.handleChangeEndTime}>
              Change End-Time
            </Button>
            <Button variant="secondary" onClick={this.toggleChangeEndTimeModal}>
              Back
            </Button>
          </Modal.Footer>
        </Modal>

        {/* endReservation modal */}
        <Modal
          show={this.state.showEndReservationModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>End Your Reservation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {endReservationModalBodyJSX}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.handleEndReservation}>
              End Reservation
            </Button>
            <Button variant="secondary" onClick={this.toggleEndReservationModal}>
              Back
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    )
  }
}

export default ReservationsView
