import axios from "axios";
import urlConfig from "./urlConfigAPI";


function getAllAvailableParkingSpots() {
  return axios({
    method: "get",
    url: urlConfig + "/available-parking-spots"
  })
}

export {
  getAllAvailableParkingSpots,
}
