/*
* Configuration file
* */

import dotenv from "dotenv"
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';


/**
 * makes environment variables accessible within JS through process.env
 */
// execute dotenv configuration
dotenv.config()


/**
 * Launch logrocket
 * https://app.logrocket.com/ucdgkj/secure-my-spot/settings/setup
 */
LogRocket.init('ucdgkj/secure-my-spot');
setupLogRocketReact(LogRocket);

export function logUser(user) {
  LogRocket.identify(user.email, {
    email: user.email
  })
}
