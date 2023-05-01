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

```sql
insert into brand (id) values ('gucci');
insert into website (domain, multi_brand, second_hand) values ('gucci.com', false, false);
```

```sql
select i.id, i.name, ai.gender, i.price, i.item_url from abstract_item ai
join item i on i.abstract_item_id = ai.id
join item_color ic on ic.item_id = i.id
join color c on c.name = ic.color_id
join item_image ii on ii.item_id = i.id
join image on image.url = ii.image_id
join item_category ica on ica.item_id = i.id
join category ca on ca.id = ica.category_id
join item_size its on its.item_id = i.id
join size s on s.size = its.size_id
order by i.price desc;
```

### high level

1. scrape and put data into results
2. take data from results, put into db
3. do shit

### proxies

pay per ip at smartproxy
pay per gb at the rest
