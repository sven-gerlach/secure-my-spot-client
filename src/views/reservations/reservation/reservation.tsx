/**
 * Module for a summary component of a single existing reservation
 */

// import
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

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
   * @return: boolean -> returns true if current time < end_time
   */
  isReservationActive () {
    const time_now = Date.now()
    const end_time = Date.parse(this.props.reservation.end_time)
    return end_time > time_now
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
          handleSubmit={this.props.toggleEndReservationModal}
        />
      </>
    )

    return (
      <>
        <h3>Reservation ID:</h3>
        <p>{reservation.id}</p>
        <h3>Parking Spot:</h3>
        <p>{reservation.parking_spot}</p>
        <h3>Start Time:</h3>
        <p>{reservation.start_time}</p>
        <h3>End Time:</h3>
        <p>{reservation.end_time}</p>
        {this.isReservationActive() ? buttonJSX : ""}
      </>
    )
  }
}

export default Reservation
