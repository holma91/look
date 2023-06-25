## Restyle

https://shopify.engineering/5-ways-to-improve-your-react-native-styling-workflow

### Restyle functions

Specify how props should be mapped to values in a resulting style object, that can then be passed down to a RN component.

Restyle comes with 2 predefined components:
**Box**:

# Shopping Research

### Most popular websites

Zalando, Zara, Boozt, Asos, HM

## Clerk

**users**:

The User object holds all the information for a user of your application and provides a set of methods to manage their account. Users have a unique authentication identifier which might be their email address, phone number or a username.

**syncing to backend**:
user and session changes might have to be synced to a backend. for this: https://clerk.com/docs/users/sync-data-to-your-backend.

## injection script

const scriptElements = document.querySelectorAll(
'script[type="application/ld+json"]'
);

// Iterate over the NodeList and process each matching element
scriptElements.forEach((scriptElement) => {
// Extract the JSON content and parse it into a JavaScript object
const data = JSON.parse(scriptElement.textContent);

// Log the data to the console
console.log(data);
});
