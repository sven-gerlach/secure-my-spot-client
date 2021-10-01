import axios from "axios";

// todo: make url flexible subject to environment
function signUp(data) {
  return axios({
    method: "post",
    url: "http://localhost:8000/sign-up/",
    data: {
      "credentials": {
        "email": data.email,
        "password": data.password,
        "password_confirmation": data.passwordConfirmation
      },
    },
  })
}

export default signUp
