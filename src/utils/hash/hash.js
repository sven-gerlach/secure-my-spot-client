// Importing 'crypto' module
// source: https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options
import * as crypto from "crypto";

function getHashedPassword(password) {
  return crypto.createHash('sha1').update(password).digest('hex')
}

export default getHashedPassword
