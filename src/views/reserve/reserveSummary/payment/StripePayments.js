/**
 * Module for making a Stripe payment request and handling the response
 */

// React imports
import React, { useState, useEffect } from "react";

// Stripe imports
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// import utils
import { createStripePaymentIntent } from "../../../../httpRequests/payment";

// import styling
import "./stripe.css"

// This is your test publishable API key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_TEST_KEY);

export default function StripePayments(props) {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const data = { email: props.email, reservation_id: props.reservation.id }
    createStripePaymentIntent(data)
      .then(res => {
        setClientSecret(res.data.clientSecret)
      })
      .catch(e => console.error(e))
    // eslint-disable-next-line
  }, []);

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
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
}
