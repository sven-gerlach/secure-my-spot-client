// crypto-js module
// https://github.com/brix/crypto-js
// https://github.com/brix/crypto-js
// https://cryptojs.gitbook.io/docs/
import CryptoJS from "crypto-js"

function getHashedPassword(password) {
  // configure dotenv library
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
}

export default getHashedPassword

