import axios from "axios";
import urlHostname from "./urlConfig";


function getReservation(reservationID, email) {
  return axios({
    method: "get",
    url: urlHostname + "/reservation/" + reservationID + "/" + email + "/"
  })
}

function getActiveReservationsAuth(token) {
  return axios({
    method: "get",
    url: urlHostname + "/active-reservations/",
    headers: {
      "Authorization": `Token ${token}`
    },
  })
}

function getExpiredReservationsAuth(token) {
  return axios({
    method: "get",
    url: urlHostname + "/expired-reservations",
    headers: {
      "Authorization": `Token ${token}`
    },
  })
}


export {
  getReservation,
  getActiveReservationsAuth,
  getExpiredReservationsAuth,
}
