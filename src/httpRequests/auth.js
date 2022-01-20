import axios from "axios";
import urlHostnameAPI from "./urlConfigAPI";


/**
 * Create a new user account
 * @param {object} data - an object containing the user's email address, password, and password_confirmation key-value
 * pairs
 * @return {promise}
 */
function signUpRequest(data) {
  return axios({
    method: "post",
    url: urlHostnameAPI + "/sign-up/",
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
    url: urlHostnameAPI + "/sign-in/",
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
    url: urlHostnameAPI + "/sign-out",
    headers: {
      "Authorization": `Token ${token}`
    }
  })
}

/**
 * Changing the password of an authenticated and authorized user
 * @param token
 * @param data
 * @return {AxiosPromise}
 */
function sendChangePasswordRequest(token, data) {
  return axios({
    method: "patch",
    url: urlHostnameAPI + "/change-pw/",
    headers: {
      "Authorization": `Token ${token}`
    },
    data: data
  })
}

export {
  signUpRequest,
  signInRequest,
  signOutRequest,
  sendChangePasswordRequest,
}
