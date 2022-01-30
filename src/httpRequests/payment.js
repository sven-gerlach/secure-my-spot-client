/**
 * Module for all http requests associated with Stripe payment endpoints
 */

import axios from "axios";
import urlHostnameAPI from "./urlConfigAPI";


/**
 *
 * @param reservationId
 * @param token
 * @return {AxiosPromise}
 */
function createStripeSetupIntentAuth(reservationId, token) {
  return axios({
    method: "post",
    url: urlHostnameAPI + "/create-payment-intent-auth/" + reservationId + "/",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
  })
}


/**
 *
 * @param reservationId
 * @param token
 * @return {AxiosPromise}
 */
function sendReservationConfirmationToAPIAuth(reservationId, token) {
  return axios({
    method: "get",
    url: urlHostnameAPI + "/confirm-successful-setup-intent-auth/" + reservationId + "/",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
    },
  })
}


/**
 *
 * @param reservationId
 * @param email
 * @return {AxiosPromise}
 */
function createStripeSetupIntentUnauth(reservationId, email) {
  return axios({
    method: "post",
    url: urlHostnameAPI + "/create-payment-intent-unauth/" + reservationId + "/" + email + "/",
    headers: {
      "Content-Type": "application/json"
    },
  })
}


/**
 *
 * @param reservationID
 * @param email
 * @return {AxiosPromise}
 */
function sendReservationConfirmationToAPIUnauth(reservationId, email) {
  return axios({
    method: "get",
    url: urlHostnameAPI + "/confirm-successful-setup-intent-unauth/" + reservationId + "/" + email + "/",
    headers: {
      "Content-Type": "application/json"
    },
  })
}


export {
  createStripeSetupIntentAuth,
  sendReservationConfirmationToAPIAuth,
  createStripeSetupIntentUnauth,
  sendReservationConfirmationToAPIUnauth,
}
