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

// Import React
import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";

// import custom components
import PageTitle from "../../components/pageTitle/PageTitle";
import PaymentStatus from "../reserve/reserveSummary/payment/PaymentStatus";
import ReservationsAuth from "./userStatus/reservationsAuth";
import ReservationsUnauth from "./userStatus/reservationsUnauth";

// Stripe imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// import interfaces
import { IReservation } from "../../types";

interface IProps {
  enqueueNewAlert: (variant: string, heading: string, message: string) => void,
  user?: { email: string, token: string },
  reservation: IReservation
  setReservation: (reservation: IReservation | null) => void
}

interface IState {
  pageTitle: string,
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_TEST_KEY as string)

class ReservationsView extends Component<RouteComponentProps & IProps, IState> {
  constructor(props: RouteComponentProps & IProps) {
    super(props);
    this.state = {
      pageTitle: "My Reservations",
    }
  }

  handleSetPageTitleState = (pageTitle: string) => {
    this.setState({ pageTitle: pageTitle })
  }

  /**
   * Returns the redirect status from the url string or null if no such query string is available
   */
  getStripeRedirectStatus = () => {
    return new URLSearchParams(window.location.search).get(
      'redirect_status'
    );
  }

  render() {
    return (
      <>
        <PageTitle titleText={this.state.pageTitle} />

        {this.props.user && (
          <ReservationsAuth
            {...this.props}
            handleSetPageTitleState={this.handleSetPageTitleState}
          />
        )}

        {!this.props.user && (
          <ReservationsUnauth
            {...this.props}
          />
        )}

        {this.props.reservation && this.getStripeRedirectStatus() && (
          <Elements stripe={stripePromise} >
            <PaymentStatus {...this.props} />
          </Elements>
        )}
      </>
    )
  }
}

export default ReservationsView
