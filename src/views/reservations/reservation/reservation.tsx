/**
 * Module for a summary component of a single existing reservation
 */

// import
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

// import custom components
import CustomButton from "../../../components/button/CustomButton";
import { Reservation as CustomReservationSummary } from "../../../components/reservation/Reservation";

// import styled components
import {
  DivStyled,
  ContainerDiv
} from "./reservation.styles";

// import utils
import { updateReservationAuth, updateReservationUnauth } from "../../../httpRequests/reservation";
import { round } from "lodash";
import { DateTime } from "luxon";
import camelcaseKeys from "camelcase-keys";
import messages from "../../../utils/alertMessages";

// import interfaces
import { IReservation } from "../../../types";

interface IProps {
  reservation: IReservation,
  setReservation: (reservation: IReservation | null) => void,
  user?: { email: string, token: string },
  enqueueNewAlert: (variant: string, heading: string, message: string) => void,
  handleActiveReservationsAuth?: () => void,
}

interface IState {
  reservationForModal: IReservation | null,
  reservationEndTimeForModal: string,
  showChangeEndTimeModal: boolean,
  changeEndTimeFormValidated: boolean,
  showEndReservationModal: boolean,
}

class Reservation extends Component<RouteComponentProps & IProps, IState> {
  formRef: React.RefObject<HTMLFormElement>

  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.formRef = React.createRef()
    this.state = {
      reservationForModal: null,
      reservationEndTimeForModal: "",
      showChangeEndTimeModal: false,
      changeEndTimeFormValidated: false,
      showEndReservationModal: false,
    }
  }

  handleInputValueChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const value = e.target.value
    this.setState(
      { [key]: value } as Pick<IState, "reservationEndTimeForModal">
    )
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
    e.preventDefault()

    const {
      reservationForModal,
      reservationEndTimeForModal
    } = this.state

    const { user } = this.props

    // grab the form element from the formRef and check for validation
    const form = this.formRef.current
    if (form?.checkValidity() === false) {
      e.stopPropagation()
      this.setState({ changeEndTimeFormValidated: true })
    }
    else {
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
          this.props.setReservation(data)
          // close modal
          this.setState({ showChangeEndTimeModal: false })
          // enqueue a success message
          this.props.enqueueNewAlert(...messages.changeReservationTimeSuccess)
          // download all active reservations
          if (user) {
            // @ts-ignore
            setTimeout(() => this.props.handleActiveReservationsAuth(), 3000)
          }
        })
        .catch((e: any) => {
          this.props.enqueueNewAlert(...messages.changeReservationTimeFailure)
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
        this.props.setReservation(null)
        // close modal
        this.setState({ showEndReservationModal: false })
        this.props.enqueueNewAlert(...messages.endReservationSuccess)
        // download all active reservations
        if (user) {
          // @ts-ignore
          setTimeout(() => this.props.handleActiveReservationsAuth(), 3000)
        }
      })
      .catch((e: any) => {
        this.props.enqueueNewAlert(...messages.endReservationFailure)
      })
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
   * @return: boolean -> returns true if current time < endTime
   */
  isReservationActive () {
    const timeNow = Date.now()
    const endTime = Date.parse(this.props.reservation.endTime)
    return endTime > timeNow
  }

  render () {
    const { reservation } = this.props

    const changeEndTimeModalBodyJSX = (
      <>
        <Form noValidate validated={this.state.changeEndTimeFormValidated} ref={this.formRef} >
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

    const buttonJSX = (
      <DivStyled>
        <CustomButton
          buttonText="Change Time"
          handleSubmit={() => {
            // set the relevant reservation for the modal to use
            this.setReservationForModalState(reservation)
            // toggle modal
            this.toggleChangeEndTimeModal()
          }}
        />
        <CustomButton
          buttonText="End Reservation"
          variant={"danger"}
          handleSubmit={() => {
            // set the relevant reservation for the modal to use
            this.setReservationForModalState(reservation)
            // toggle modal
            this.toggleEndReservationModal()
          }}
        />
      </DivStyled>
    )
    const startTime = Date.parse(reservation.startTime)
    const endTime = Date.parse(reservation.endTime)
    // note: smallest time-delta is always a multiple of a full minute
    const timeDeltaMinutes = (endTime - startTime) / 60000

    return (
      <>
        <ContainerDiv>
          <CustomReservationSummary
            reservationID={reservation.id}
            parkingSpotID={reservation.parkingSpot}
            startTime={reservation.startTime}
            endTime={reservation.endTime}
            totalReservationCost={timeDeltaMinutes / round(Number(reservation.rate) / 60, 2)}
          />
          {this.isReservationActive() && (
            buttonJSX
          )}
        </ContainerDiv>

        {/* Change end-time modal */}
        <Modal
          show={this.state.showChangeEndTimeModal}
          backdrop={"static"}
          centered={true}
          keyboard={false}
        >
          <Modal.Header>
            <Modal.Title>Set a New End-Time</Modal.Title>
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
            <Button variant="danger" onClick={this.handleEndReservation}>
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

export default Reservation
