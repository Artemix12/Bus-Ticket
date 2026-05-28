// import { createAuthClient } from "better-auth/client";
// import { adminClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
export const authClient = createAuthClient({
    plugins: [
        adminClient()  
    ]
})
