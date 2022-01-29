/**
 * Module for making a Stripe payment request and handling the response
 */

// React imports
import React, { useState, useEffect } from "react";

// Stripe imports
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import SetupForm from "./SetupForm";

// import utils
import { createStripeSetupIntent } from "../../../../httpRequests/payment";
import {
  sendAuthDeleteRequestToAPI,
  sendUnauthDeleteRequestToAPI
} from "../../../../httpRequests/reservation";

// import styling
import "./stripe.css"

// This is your test publishable API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_TEST_KEY);

export default function StripePayments(props) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create SetupIntent as soon as the page loads
    const data = { email: props.email, reservation_id: props.reservation.id }
    createStripeSetupIntent(data)
      .then(res => {
        setClientSecret(res.data.clientSecret)
      })
      .catch(e => console.error(e))
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // if user navigates away from the page, cancel the reservation of the parking slot
    return () => {
      // make API call to release reserved parking spot
      if (props.user) {
        sendAuthDeleteRequestToAPI(props.reservation.id, props.user.token)
      }
      else {
        sendUnauthDeleteRequestToAPI(props.reservation.id, props.reservation.email)
      }

      // reset reservation state to null
      props.setReservation(null)
    }
    // eslint-disable-next-line
  }, [])

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="StripePayments">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <SetupForm enqueueNewAlert={props.enqueueNewAlert} />
        </Elements>
      )}
    </div>
  );
}
