/**
 * Module for a summary component of a single existing reservation
 */

// import
import React, { Component } from "react";

// import custom components
import CustomButton from "../../../components/button/CustomButton";

// import interfaces
import { IReservation } from "../../../types";

interface IProps {
  reservation: IReservation,
  toggleChangeEndTimeModal: () => void,
  toggleEndReservationModal: () => void,
  setReservationForModalState: (reservation: IReservation) => void,
}

class Reservation extends Component<IProps> {
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

    const buttonJSX = (
      <>
        <CustomButton
          buttonText="Change End-Time"
          handleSubmit={() => {
            // set the relevant reservation for the modal to use
            this.props.setReservationForModalState(reservation)
            // toggle modal
            this.props.toggleChangeEndTimeModal()
          }}
        />
        <CustomButton
          buttonText="End Reservation"
          variant={"warning"}
          handleSubmit={() => {
            // set the relevant reservation for the modal to use
            this.props.setReservationForModalState(reservation)
            // toggle modal
            this.props.toggleEndReservationModal()
          }}
        />
      </>
    )

    return (
      <>
        <h3>Reservation ID:</h3>
        <p>{reservation.id}</p>
        <h3>Parking Spot:</h3>
        <p>{reservation.parkingSpot}</p>
        <h3>Start Time:</h3>
        <p>{reservation.startTime}</p>
        <h3>End Time:</h3>
        <p>{reservation.endTime}</p>
        {this.isReservationActive() ? buttonJSX : ""}
      </>
    )
  }
}

export default Reservation
