import axios from "axios";
import urlHostname from "./urlConfig";


function signUp(data) {
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

function signIn(data) {
  console.log(data)
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

export {
  signUp,
  signIn,
}
