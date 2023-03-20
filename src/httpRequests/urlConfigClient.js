/* Configure the hostname part of the api url subject to the environment the client is executed in */

let urlHostnameClient = process.env.REACT_APP_CLIENT_HOST

if (!urlHostnameClient) {
  throw new Error('The REACT_APP_CLIENT_HOST environment variable is undefined. Please provide the correct CLIENT URL.')
}

export default urlHostnameClient
