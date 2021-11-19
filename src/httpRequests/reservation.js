import axios from "axios";
import urlHostname from "./urlConfig";
import urlConfig from "./urlConfig";
import { string } from "yup";


/**
 * Create a reservation for an unauthenticated user
 * @param parkingSpotId
 * @param data
 * @return {AxiosPromise}
 */
function createReservationUnauthUser(parkingSpotId, data) {
  return axios({
    method: "post",
    url: urlConfig + "/reservation-unauth/" + parkingSpotId + "/",
    data: data
  })
}

/**
 * Create a reservation for an authenticated user
 * @param parkingSpotId
 * @param token
 * @param data
 * @return {AxiosPromise}
 */
function createReservationAuthUser(parkingSpotId, token, data) {
  return axios({
    method: "post",
    url: urlConfig + "/reservation-auth/" + parkingSpotId + "/",
    headers: {
      "Authorization": `Token ${token}`
    },
    data: data
  })
}

/**
 * Retrieve a reservation for an unauthenticated user
 * @param reservationID
 * @param email
 * @return {AxiosPromise}
 */
function getReservationUnauth(reservationID, email) {
  return axios({
    method: "get",
    url: urlHostname + "/reservation-unauth/" + reservationID + "/" + email + "/"
  })
}

/**
 * Retrieve all active reservations for an authenticated user
 * @param token
 * @return {AxiosPromise}
 */
function getActiveReservationsAuth(token) {
  return axios({
    method: "get",
    url: urlHostname + "/reservation-auth/",
    headers: {
      "Authorization": `Token ${token}`
    },
  })
}

/**
 * Retrieve all expired reservations for an authenticated user
 * @param token
 * @return {AxiosPromise}
 */
function getExpiredReservationsAuth(token) {
  return axios({
    method: "get",
    url: urlHostname + "/expired-reservations-auth",
    headers: {
      "Authorization": `Token ${token}`
    },
  })
}


/**
 * Provide either email (unauthenticated) or token (authenticated user) to either change the end_time (stored in data)
 * or if data attribute is null end the reservation immediately.
 * @param reservationID
 * @param token
 * @param data
 * @return {AxiosPromise}
 */
function updateReservationAuth(reservationID, token, data) {
  return axios({
    method: "patch",
    url: urlHostname + "/update-reservation-auth/" + reservationID + "/",
    headers: {
      "Authorization": `Token ${token}`
    },
    data: data
  })
}

/**
 *
 * @param reservationID
 * @param email
 * @param data
 * @return {AxiosPromise}
 */
function updateReservationUnauth(reservationID, email, data) {
  return axios({
    method: "patch",
    url: urlHostname + "/update-reservation-unauth/" + reservationID + "/" + email + "/",
    data: data
  })
}

export {
  createReservationUnauthUser,
  createReservationAuthUser,
  getReservationUnauth,
  getActiveReservationsAuth,
  getExpiredReservationsAuth,
  updateReservationAuth,
  updateReservationUnauth,
}
