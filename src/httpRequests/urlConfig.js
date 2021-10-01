/* Configure the hostname part of the api url subject to the environment the client is executed in */

let urlHostname

const urlHostnames = {
  "development": "http://localhost:8000",
  "production": "https://secure-my-spot-client.herokuapp.com",
}

if (window.location.hostname === "localhost") {
  urlHostname = urlHostnames.development
}
else {
  urlHostname = urlHostnames.production
}

export default urlHostname
