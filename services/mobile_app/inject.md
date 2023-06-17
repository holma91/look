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
