import axios from "axios";
import urlHostname from "./urlConfig";


/**
 * Create a new user account
 * @param {object} data - an object containing the user's email address, password, and password_confirmation key-value
 * pairs
 * @return {promise}
 */
function signUpRequest(data) {
  return axios({
    method: "post",
    url: urlHostname + "/sign-up/",
    data: {
      "credentials": {
        "email": data.email,
        "password": data.password,
        "password_confirmation": data.passwordConfirmation,
      },
    },
  })
}

/**
 * Signing a user into their account and returning a token
 * @param {object} data - an object containing the user's email address and password
 * @return {promise}
 */
function signInRequest(data) {
  return axios({
    method: "post",
    url: urlHostname + "/sign-in/",
    data: {
      "credentials": {
        "email": data.email,
        "password": data.password,
      },
    },
  })
}

/**
 * Signing an authenticated user out
 * @param {string} token - the user's token
 * @return {promise}
 */
function signOutRequest(token) {
  return axios({
    method: "delete",
    url: urlHostname + "/sign-out",
    headers: {
      "Authorization": `Token ${token}`
    }
  })
}

export {
  signUpRequest,
  signInRequest,
  signOutRequest,
}
