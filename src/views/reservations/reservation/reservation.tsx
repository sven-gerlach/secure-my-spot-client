/**
 * Module for a summary component of a single existing reservation
 */

// import
import React, { Component } from "react";

// import custom components
import CustomButton from "../../../components/button/CustomButton";
import { Reservation as CustomReservationSummary } from "../../../components/reservation/Reservation";

// import interfaces
import { IReservation } from "../../../types";
import { round } from "lodash";

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
    const startTime = Date.parse(reservation.startTime)
    const endTime = Date.parse(reservation.endTime)
    // note: smallest time-delta is always a multiple of a full minute
    const timeDeltaMinutes = (endTime - startTime) / 60000

    return (
      <>
        <CustomReservationSummary
          reservationID={reservation.id}
          parkingSpotID={reservation.parkingSpot}
          startTime={reservation.startTime}
          endTime={reservation.endTime}
          totalReservationCost={timeDeltaMinutes / round(Number(reservation.rate) / 60, 2)}
        />
        {this.isReservationActive() ? buttonJSX : ""}
      </>
    )
  }
}

export default Reservation
