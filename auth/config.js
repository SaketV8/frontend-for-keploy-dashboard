/*
 * So that we can have different type of config for our auth
 *
 * for now we have option for jwt and session
 */

const AUTH_CONFIG = {
  // session || jwt
  strategy: "jwt",
};

export default AUTH_CONFIG;
