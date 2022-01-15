/* Configure the hostname part of the api url subject to the environment the client is executed in */

let urlHostnameClient

const urlHostnames = {
  "development": "http://localhost:3000",
  "production": "https://https://secure-my-spot-client.herokuapp.com",
}

if (window.location.hostname === "localhost") {
  urlHostnameClient = urlHostnames.development
}
else {
  urlHostnameClient = urlHostnames.production
}

export default urlHostnameClient
