/**
 * Module contains message object which stores all key message headings and bodies
 */


interface IMessages {
  [key: string]: string[]
}

const messages: IMessages = {
  failedSignIn: [
    "warning",
    "Failed Authorization",
    "Wrong authentication details. Please try again.",
  ],

}

export default messages
