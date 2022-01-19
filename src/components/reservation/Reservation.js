import React, { Component } from "react";
import { Table } from "react-bootstrap";
import { DivTableStyled, TbodyStyled } from "./Reservation.styles"
import { round } from "lodash";
import moment from "moment";


export class Reservation extends Component {

  render() {
    const {
      reservationID=null,
      parkingSpotID=null,
      parkingSpotGPS=null,
      ratePerHour=null,
      ratePerMinute=null,
      totalReservationCost=null,
      startTime=null,
      endTime=null,
    } = this.props

    return (
      <DivTableStyled>
        <Table borderless size={"sm"} className={"mb-0"}>
          <TbodyStyled>
            {reservationID === null ? undefined : (
              <tr>
                <td>Reservation ID</td>
                <td>{reservationID}</td>
              </tr>
            )}
            {parkingSpotID === null ? undefined : (
              <tr>
                <td>Parking Spot ID</td>
                <td>{parkingSpotID}</td>
              </tr>
            )}
            {parkingSpotGPS === null ? undefined : (
              <tr>
                <td>GPS</td>
                <td>{parkingSpotGPS}</td>
              </tr>
            )}
            {startTime === null ? undefined : (
              <tr>
                <td>Start Time</td>
                <td>{moment(startTime).format("HH:mm (Do MMM YYYY)")}</td>
              </tr>
            )}
            {endTime === null ? undefined : (
              <tr>
                <td>End Time</td>
                <td>{moment(endTime).format("HH:mm (Do MMM YYYY)")}</td>
              </tr>
            )}
            {ratePerHour === null ? undefined : (
              <tr>
                <td>$ / hr</td>
                <td>{ratePerHour.toFixed(2)}</td>
              </tr>
            )}
            {ratePerMinute === null ? undefined : (
              <tr>
                <td>$ / min</td>
                <td>{round(ratePerMinute, 2).toFixed(2)}</td>
              </tr>
            )}
            {totalReservationCost === null ? undefined : (
              <tr>
                <td>$</td>
                <td>{totalReservationCost.toFixed(2)}</td>
              </tr>
            )}
          </TbodyStyled>
        </Table>
      </DivTableStyled>
    )
  }
}
