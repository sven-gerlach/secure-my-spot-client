/* Configure the hostname part of the api url subject to the environment the client is executed in */

let urlHostnameAPI

const urlHostnames = {
  "development": "http://localhost:8000",
  "production": "https://secure-my-spot-api.herokuapp.com",
}

if (window.location.hostname === "localhost") {
  urlHostnameAPI = urlHostnames.development
}
else {
  urlHostnameAPI = urlHostnames.production
}

export default urlHostnameAPI
