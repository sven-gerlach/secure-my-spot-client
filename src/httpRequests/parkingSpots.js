import axios from "axios";
import urlConfig from "./urlConfig";


function getAllAvailableParkingSpots() {
  return axios({
    method: "get",
    url: urlConfig + "/available-parking-spots"
  })
}

function createParkingSpotReservationUnauthUser(parkingSpotId, data) {
  return axios({
    method: "post",
    url: urlConfig + "/reservation/" + parkingSpotId + "/",
    data: data
  })
}

function createParkingSpotReservationAuthUser(parkingSpotId, token, data) {
  return axios({
    method: "post",
    url: urlConfig + "/reservation/" + parkingSpotId + "/",
    headers: {
      "Authorization": `Token ${token}`
    },
    data: data
  })
}

export {
  getAllAvailableParkingSpots,
  createParkingSpotReservationUnauthUser,
  createParkingSpotReservationAuthUser,
}
