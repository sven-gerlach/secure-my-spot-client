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

// todo: split module into two components -> 1) auth and 2) unauth

// Import
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { DateTime } from "luxon";

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
  getReservationUnauth,
  getActiveReservationsAuth,
  getExpiredReservationsAuth,
  updateReservationAuth,
  updateReservationUnauth,
} from "../../httpRequests/reservation";
import Reservation from "./reservation/reservation";

// import interfaces
import { IReservation } from "../../types";
import camelcaseKeys from "camelcase-keys";


interface IProps {
  user?: { email: string, token: string },
  reservation: IReservation
  setReservation: (reservation: IReservation | null) => void
}

interface IState {
  reservations: IReservation[],
  reservationForModal: IReservation | null,
  reservationEndTimeForModal: string,
  showChangeEndTimeModal: boolean,
  formValidated: boolean,
  showEndReservationModal: boolean,
  emailField: string,
  reservationIdField: string,
}

class ReservationsView extends Component<RouteComponentProps & IProps, IState> {
  formRef: React.RefObject<HTMLFormElement>

  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.formRef = React.createRef()
    this.state = {
      reservations: [],
      reservationForModal: null,
      reservationEndTimeForModal: "",
      showChangeEndTimeModal: false,
      formValidated: false,
      showEndReservationModal: false,
      emailField: "",
      reservationIdField: "",
    }
  }

  componentDidMount() {
    // if the user is authenticated, retrieve any active reservations from the api
    if (this.props.user && !this.props.reservation) {
      this.handleActiveReservationsAuth()
    }
  }

  setReservationForModalState = (reservation: IReservation) => {
    // set the reservation relevant for the model
    this.setState({ reservationForModal: reservation }, () => {
      // set the time string in state, using format "hh:mm". This is needed for the modal that offers the user the option
      // to change the end-time of the reservation
      // parse endTime and generate string in format hh:mm
      let endTimeString = ""
      if (this.state.reservationForModal) {
        const parsedEndTime = DateTime.fromISO(this.state.reservationForModal.endTime)
        endTimeString = parsedEndTime.toLocaleString({ hour: "2-digit", minute: "2-digit" })
      }
      this.setState({ reservationEndTimeForModal: endTimeString })
    })
  }

  /**
   * Make api call to change the end-time of a reservation
   * @param e
   */
  handleChangeEndTime = (e: React.MouseEvent<HTMLButtonElement>) => {
    const {
      reservationForModal,
      reservationEndTimeForModal
    } = this.state

    const { user } = this.props

    // grab the form element from the formRef and check for validation
    const form = this.formRef.current
    if (form?.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    else {
      this.setState({ formValidated: true })

      // set the endTime in local time
      const endTime = DateTime.fromObject(
        {
          hour: Number(reservationEndTimeForModal.substr(0,2)),
          minute: Number(reservationEndTimeForModal.substr(3,2))
        },
        {
          zone: "America/New_York"
        })

      // construct the data object with the endTime converted to UTC
      const data = {
        "reservation": {
          "end_time": endTime.toUTC()
        }
      }

      // call the api to update the reservation with the new endTime, api end-point is subject to whether the user is
      // authenticated
      let updatedReservationPromise
      if (user) {
        updatedReservationPromise = updateReservationAuth(reservationForModal?.id, user?.token, data)
      }
      else {
        updatedReservationPromise = updateReservationUnauth(reservationForModal?.id, reservationForModal?.email, data)
      }
      updatedReservationPromise
        .then((res: any) => {
          // update the reservation state in App
          const data = camelcaseKeys(res.data)
          console.log("Cancel reservation 1")
          console.log(res)
          this.props.setReservation(data)
          // close modal
          this.setState({ showChangeEndTimeModal: false })
        })
        .catch((e: any) => {
          console.error(e)
        })
    }
  }

  /**
   * Make a call to the api to end a reservation
   * @param e
   */
  handleEndReservation = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { user } = this.props
    const { reservationForModal } = this.state

    // set the endTime to now
    const endTime = DateTime.now()

    // convert endTime to UTC
    const endTimeUTC = endTime.toUTC()

    // construct the data object
    const data = {
      "reservation": {
        "end_time": endTimeUTC
      }
    }

    // call the api to update the reservation with the new endTime, api end-point is subject to whether the user is
    // authenticated
    let updatedReservationPromise

    if (user) {
      updatedReservationPromise = updateReservationAuth(reservationForModal?.id, user?.token, data)
    }
    else {
      updatedReservationPromise = updateReservationUnauth(reservationForModal?.id, reservationForModal?.email, data)
    }

    updatedReservationPromise
      .then((res: any) => {
        // update reservation state in App component
        console.log("Cancel reservation 2")
        this.props.setReservation(null)
        // close modal
        this.setState({ showEndReservationModal: false })
      })
      .catch((e: any) => {
        console.error(e)
      })
  }

  /**
   * Retrieve a reservation for an unauthenticated user, given the provided email and the reservationID
   * @param e
   */
  handleRetrieveReservationUnauth = (e: React.MouseEvent<HTMLButtonElement>) => {
    // call API
    getReservationUnauth(this.state.reservationIdField, this.state.emailField)
      .then((res: { data: IReservation | null; }) => {
        // todo: loading another but still current reservation causes the endTime input field to be displayed incorrectly
        const data = camelcaseKeys(res.data!)
        console.log("Cancel reservation 3")
        this.props.setReservation(data)
      })
      .catch((e: any) => console.error(e))
  }

  handleInputValueChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const value = e.target.value
    this.setState(
      { [key]: value } as Pick<IState, "emailField" | "reservationIdField" | "reservationEndTimeForModal">
    )
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
      console.log("Cancel reservation 4")
      this.props.setReservation(null)

      // retrieve active reservations from API
      getActiveReservationsAuth(this.props.user.token)
        .then((res: { data: any; }) => {
          const data = camelcaseKeys(res.data)
          this.setState({ reservations: data })
        })
        .catch((e: any) => {
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
        .then((res: { data: any; }) => {
          const data = camelcaseKeys(res.data)
          this.setState({ reservations: data })
        })
        .catch((e: any) => {
          console.error(e)
        })
    }
  }

  render() {
    const { reservation, user } = this.props

    console.log(this.props)

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
            setReservationForModalState={this.setReservationForModalState}
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
                setReservationForModalState={this.setReservationForModalState}
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
          <h3>Not what you are looking for?</h3>
          <p>Alternatively, you can display all of your active or expired reservations.</p>
          <CustomButton
            buttonText="Active"
            handleSubmit={this.handleActiveReservationsAuth}
          />
          <CustomButton
            buttonText="Expired"
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
              name="emailField"
              placeholder="a"
              onChange={this.handleInputValueChange}
            />
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label="Reservation ID">
            <Form.Control
              type="text"
              placeholder="a"
              name="reservationIdField"
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
        <Form noValidate validated={this.state.formValidated} ref={this.formRef} >
          <Form.Label>End-Time</Form.Label>
          <Form.Control
            type="time"
            name="reservationEndTimeForModal"
            min={DateTime.now().toLocaleString({ hour: "2-digit", minute: "2-digit" })}
            value={this.state.reservationEndTimeForModal}
            onChange={this.handleInputValueChange}
          />
          <Form.Control.Feedback type="invalid">Enter a time that lies in the future</Form.Control.Feedback>
        </Form>
      </>
    )

    const endReservationModalBodyJSX = (
      <>
        <p>
          If you confirm to end your reservation, your reservation will expire immediately. You will not be charged for
          any unused time.
        </p>
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
              Confirm
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
