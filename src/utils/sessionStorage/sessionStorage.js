/*
* Module retrieves and stores user in session storage
* */
import {
  getDecryptedObject,
  getEncryptedObject,
} from "../hash/hash";

/*
 * Retrieve object from session storage
 * $param {string} objName - the name of the item that needs to be retrieved from browser session storage
 * */
function getUserFromSessionStorage() {
  const serializedUser = sessionStorage.getItem("user")
  if (!serializedUser) {
    return undefined
  }

  // decrypt and deserialize object
  return getDecryptedObject(serializedUser)
}

/*
 * Store object in session storage
 * */
function storeUserInSessionStorage(obj) {
  // update session storage with current state to make token persistent beyond session
  // serialize and encrypt the user object
  const encryptedObj = getEncryptedObject(obj)
  sessionStorage.setItem("user", encryptedObj)
}

export {
  getUserFromSessionStorage,
  storeUserInSessionStorage,
}
