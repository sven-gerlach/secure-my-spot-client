/**
 * Configure LogRocket
 * https://app.logrocket.com/ucdgkj/secure-my-spot/settings/setup
 */

import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";


// initialise LogRocket
export function initialiseLogRocket() {
  LogRocket.init('ucdgkj/secure-my-spot');
  setupLogRocketReact(LogRocket);
}

// when a user signs in this function is being called, providing user data to LogRocket such that the user is
// identifiable in the log record
export function logUser(user) {
  LogRocket.identify(user.email, {
    email: user.email
  })
}

