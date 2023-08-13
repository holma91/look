## OAuth2

OAuth2 was designed so that the backend or API could be independent of the server that authenticates the user. We will use the same server for both though.

In OAuth2 a "scope" is just a string that declares a specific permission required.

## JWT

The JWT specification says that there's a key "sub", with the subject of the token.

## fastapi

`Depends(oauth2_scheme)` will make the endpoint go look in the request for the Authorization header, and check if the value is "Bearer" plus whatever.

OAuth2PasswordRequestForm is a class dependency that declares a form body with:

- The username.
- The password.
- An optional scope field as a big string, composed of strings separated by spaces.
- An optional grant_type.

### thoughts

What does it mean if I use e.g google as my auth provider?

1. User signs up with google
   -> we receive a google ID for the user

2. User signs in with google
   -> user receives an auth token
   -> user sends requests to the server with the auth token
   -> we verify the auth token

So, the only thing we need from google is

1. a google id for every user
2. a way to verify the auth tokens
