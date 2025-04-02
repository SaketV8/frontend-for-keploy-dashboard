import { signInWithEmail } from "../providers/EmailProvider";
import { signInWithOAuth } from "../providers/OAuthProvider";

const signIn = {
  email: signInWithEmail,
  oauth: signInWithOAuth,
};

// /** @internal */
export { signIn };
