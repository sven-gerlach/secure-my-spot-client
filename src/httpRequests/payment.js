/**
 * Module for all http requests associated with Stripe payment endpoints
 */

import axios from "axios";
import urlHostnameAPI from "./urlConfigAPI";

/**
 *
 * @param data
 * @return {AxiosPromise}
 */
function createStripeSetupIntent(data) {
  return axios({
    method: "post",
    url: urlHostnameAPI + "/create-payment-intent-unauth/",
    headers: {
      "Content-Type": "application/json"
    },
    data: data,
  })
}


function sendReservationConfirmationToAPI(reservationID, email) {
  return axios({
    method: "get",
    url: urlHostnameAPI + "/confirm-successful-setup-intent-unauth" + "/" + reservationID + "/" + email + "/",
    headers: {
      "Content-Type": "application/json"
    },
  })
}


export {
  createStripeSetupIntent,
  sendReservationConfirmationToAPI,
}
