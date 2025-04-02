// lib/auth-client.js

// 🎀 currently using all method directly from 'own-auth-client'\
// so no use of this

// import { createAuthClient } from "@/own-auth-client";

// export const authClient = createAuthClient();

// export const { signIn, signOut, useSession } = authClient;



/////////////////////////////////////////////////////////////////
////////////////////          Note          /////////////////////
/////////////////////////////////////////////////////////////////
//
// we can have two method of using the createAuthClient
// 1) directly use authClient
//      authClient.signIn
//      authClient.signOut
//      authClient.useSesssion()
//
// 2) use the exported destructured authClient
//      signIn
//      signOut
//      const { session } = useSession()
//
/////////////////////////////////////////////////////////////////
