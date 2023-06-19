# Clerk Docs

So, what Clerk is essentially doing is generating a JWT, and giving it to the client. Our server then just needs to verify the JWT when the client asks for some information.

## OAuth

**useOAuth**: makes it possible to sign-up and sign-in in a single flow.
**useAuth**: a convenient way to access the current auth state.
**useUser**: a convenient way to access the current user data. Also provides method for logging out etc (?)

### On Web

When using OAuth, the sign in and sign up are equivalent. A successful OAuth flow consists of the following steps:

1. Start the OAuth flow by calling SignIn.authenticateWithRedirect(params) or SignUp.authenticateWithRedirect(params). Note that both of these methods require a redirectUrl param, which is the URL that the browser will be redirected to once the user authenticates with the OAuth provider.

2. Create a route at the URL redirectUrl points, typically /sso-callback, that calls the Clerk.handleRedirectCallback() or simply renders the prebuilt <AuthenticateWithRedirectCallback/> component.

### On Mobile

Just use the useOAuth hook, code here: https://github.com/clerkinc/javascript/blob/main/packages/expo/src/useOAuth.ts.

### User Object

The User object holds all the auth related information for a user of your application and provides a set of methods to manage their account. Users have a unique authentication identifier which might be their email address, phone number or a username.

Can have multiple external accounts by connecting OAuth to different providers. The user object have a bunch of methods that we can call to modify it.

user.user object: https://github.com/clerkinc/javascript/blob/main/packages/types/src/user.ts#L47
