/*
* Module retrieves and stores user in session storage
* */
import {
  getDecryptedObject,
  getEncryptedObject,
} from "./hash";


/**
 * Retrieve object from session storage
 * @param {string} objKey - object name to be retrieved from storage
 * @param {string} storageType - enum "session" or "local"
 * @return {object} userObject - contains email and token key / value pairs
 */
function getObjectFromStorage(objKey, storageType) {
  const serializedUser = storageType === "local"
    ? localStorage.getItem(objKey)
    : sessionStorage.getItem(objKey)
  if (!serializedUser) {
    return undefined
  }

  // decrypt and deserialize object
  return getDecryptedObject(serializedUser)
}

/**
 * Store object in session storage
 * @param {object} obj - contains email and token key / value pairs
 * @param {string} objKey - key name under which object is to be stored in storage
 * @param {string} storageType - enum "session" or "local"
 **/
function storeObjectInStorage(obj, objKey, storageType) {
  // update session storage with current state to make token persistent beyond session
  // serialize and encrypt the user object

  const encryptedObj = getEncryptedObject(obj)
  if (storageType === "local") {
    localStorage.setItem(objKey, encryptedObj)
  }
  else {
    sessionStorage.setItem(objKey, encryptedObj)
  }
}

/**
 * Delete user object from session storage
 * @param {string} objKey - remove key from session storage
 * @param {string} storageType - enum "session" or "local"
 */
function removeObjectFromStorage(objKey, storageType) {
  if (storageType === "local") {
    localStorage.removeItem(objKey)
  }
  else {
    sessionStorage.removeItem(objKey)
  }
}

export {
  getObjectFromStorage,
  storeObjectInStorage,
  removeObjectFromStorage,
}
