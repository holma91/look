item_id: brand:item_id

1. get all listings from api url
   The reason for this step is to get the product urls. After this step, we have all product urls.
2. go through all product urls and extract relevant data
   Does it by getting the html, extracting the schema.org stuff and maybe something else.
3. insert into database
   if something has changed since the last insert (compare by item_id), insert into the database

### Dev Console Scripts

```js
// Find all <script> elements with type="application/ld+json"
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
```

```js
let xpathExpression = '//*[@id="select2-size-4f-results"]';
let xpathResult = document.evaluate(
  xpathExpression,
  document,
  null,
  XPathResult.FIRST_ORDERED_NODE_TYPE,
  null
);
let targetElement = xpathResult.singleNodeValue;

console.log(targetElement);
```

### high level

1. scrape and put data into results
2. take data from results, put into db
3. do shit
