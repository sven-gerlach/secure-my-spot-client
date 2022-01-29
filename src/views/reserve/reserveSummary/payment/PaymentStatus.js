// PaymentStatus.jsx

import React, {useEffect} from 'react';
import {useStripe} from '@stripe/react-stripe-js';
import messages from "../../../../utils/alertMessages";
import { sendReservationConfirmationToAPI } from "../../../../httpRequests/payment";

const PaymentStatus = ({ enqueueNewAlert, reservation }) => {
  const stripe = useStripe();

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "setup_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      'setup_intent_client_secret'
    );

    // Retrieve the SetupIntent
    stripe
      .retrieveSetupIntent(clientSecret)
      .then(({setupIntent}) => {
        // Inspect the SetupIntent `status` to indicate the status of the payment
        // to your customer.
        //
        // Some payment methods will [immediately succeed or fail][0] upon
        // confirmation, while others will first enter a `processing` state.
        //
        // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
        // eslint-disable-next-line default-case
        switch (setupIntent.status) {
          case 'succeeded':
            enqueueNewAlert(...messages.stripePaymentSuccess)
            // send a request to the api to send out the reservation confirmation email
            sendReservationConfirmationToAPI(reservation.id, reservation.email)
            break;

          case 'processing':
            enqueueNewAlert(...messages.stripePaymentProcessing)
            break;

          case 'requires_payment_method':
            // Redirect your user back to your payment page to attempt collecting
            // payment again
            enqueueNewAlert(...messages.stripePaymentFailure)
            break;
        }
      });
  }, [enqueueNewAlert, stripe]);

  return <></>
};

export default PaymentStatus;
