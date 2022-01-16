/**
 * Module for all http requests associated with Stripe payment endpoints
 */

import urlConfig from "./urlConfigAPI";
import axios from "axios";


function createStripePaymentIntent(data) {
  return axios({
    method: "post",
    url: urlConfig + "/create-payment-intent/",
    headers: {
      "Content-Type": "application/json"
    },
    data: data,
  })
}

export {
  createStripePaymentIntent,
}
