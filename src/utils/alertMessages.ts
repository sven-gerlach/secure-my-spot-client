/**
 * Module contains message object which stores all key message headings and bodies
 */

type message = [string, string, string]

interface IMessages {
  [key: string]: message
}

const messages: IMessages = {
  successfulSignUp: [
    "success",
    "Successful Sign-Up",
    "Congratulation! You are signed up as well as signed in."
  ],
  successfulSignIn: [
    "success",
    "Successful Sign-In",
    "Welcome back. You are signed in."
  ],
  failedSignIn: [
    "warning",
    "Failed Authentication",
    "Wrong authentication details. Please try again.",
  ],
  successfulSignOut: [
    "success",
    "Successful Sign-Out",
    "You have been successfully signed out. Come back soon!"
  ],
  failedSignOut: [
    "warning",
    "Oops...",
    "Something went wrong. You are still signed in. Please try again."
  ],
  notFound404: [
    "warning",
    "Not Found",
    "This reservation does not exist"
  ],
}

export default messages
