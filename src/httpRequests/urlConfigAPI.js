/* Configure the hostname part of the api url subject to the environment the client is executed in */

let urlHostnameAPI = process.env.REACT_APP_API_HOST

if (!urlHostnameAPI) {
  throw new Error('The REACT_APP_API_HOST environment variable is undefined. Please provide the correct API URL.')
}

export default urlHostnameAPI
