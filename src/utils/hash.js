// crypto-js module
// https://github.com/brix/crypto-js
// https://cryptojs.gitbook.io/docs/
import CryptoJS from "crypto-js"

function getHashedPassword(password) {
  // configure dotenv library
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
}

// retrieve secrete key from environment
// loading Heroku's config vars does not work at the moment and trying to find a workaround proved to be more difficult
// for now, although not ideal, the .env.dev file contains the development key whilst the production key for encrypting
// the user object and storing it in session storage is hard-coded
const secretKey = process.env.REACT_APP_SESSION_ENCRYPTION_KEY
console.log(secretKey)

function getEncryptedObject(object) {
  return CryptoJS.AES.encrypt(JSON.stringify(object), secretKey).toString()
}

function getDecryptedObject(cipheredObj) {
  const bytes = CryptoJS.AES.decrypt(cipheredObj, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export {
  getHashedPassword,
  getEncryptedObject,
  getDecryptedObject,
}

