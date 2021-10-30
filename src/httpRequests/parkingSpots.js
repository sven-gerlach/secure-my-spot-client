import axios from "axios";
import urlConfig from "./urlConfig";


function getAllAvailableParkingSpots() {
  return axios({
    method: "get",
    url: urlConfig + "/available-parking-spots"
  })
}

function createParkingSpotReservation(parkingSpotId, data) {
  return axios({
    method: "post",
    url: urlConfig + "/reservation/" + parkingSpotId + "/",
    data: {
      "reservation": {
        "email": data.email,
        "reservation_length": data.reservationLength
      }
    }
  })
}

export {
  getAllAvailableParkingSpots,
  createParkingSpotReservation
}
