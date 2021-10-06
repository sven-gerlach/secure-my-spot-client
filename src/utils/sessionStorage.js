/*
* Module retrieves and stores user in session storage
* */
import {
  getDecryptedObject,
  getEncryptedObject,
} from "./hash";

/**
 * Retrieve object from session storage
 * @return {object} userObject - contains email and token key / value pairs
 */
function getUserFromSessionStorage() {
  const serializedUser = sessionStorage.getItem("user")
  if (!serializedUser) {
    return undefined
  }

  // decrypt and deserialize object
  return getDecryptedObject(serializedUser)
}

/**
 * Store object in session storage
 * @param {object} obj - contains email and token key / value pairs
 **/
function storeUserInSessionStorage(obj) {
  // update session storage with current state to make token persistent beyond session
  // serialize and encrypt the user object
  const encryptedObj = getEncryptedObject(obj)
  sessionStorage.setItem("user", encryptedObj)
}

/**
 * Delete user object from session storage
 * @param {string} key - remove key from session storage
 */
function removeFromSessionStorage(key) {
  sessionStorage.removeItem(key)
}

export {
  getUserFromSessionStorage,
  storeUserInSessionStorage,
  removeFromSessionStorage,
}
