// crypto-js module
// https://github.com/brix/crypto-js
// https://cryptojs.gitbook.io/docs/
import CryptoJS from "crypto-js"

function getHashedPassword(password) {
  // configure dotenv library
  return CryptoJS.SHA256(password).toString(CryptoJS.enc.Base64);
}

// todo: put secret key into .env
const secretKey = process.env.REACT_APP_SESSION_ENCRYPTION_KEY

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

