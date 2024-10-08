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
let xpathExpression = '//*[@id="product-details"]/div[2]/ul';
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
insert into brand (id) values ('loro_piana');
insert into website (domain, multi_brand, second_hand) values ('loropiana.com', false, false);
insert into brand (id) values ('moncler');
insert into website (domain, multi_brand, second_hand) values ('moncler.com', false, false);
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

### how to add a new parser

1. create parser at parsers/brand.py with Brand class that inherits from BaseParser.
2. add seeds, header and urls at utils/information.
   go to the console and try to find an api they are calling
   make a manual verification of if the api gets everything
3. implement get_primitive_items.
4. implement get_extracted_item.

### Rules

after parsing, the following must exist in the data:

always in schema: id, url, currency, price, name, description,  
not always in schema (read these from APIs or the HTML):

- colors
- images
- breadcrumbs
- sizes

### thinking

every article has a product code
often something like this: product:color:size
leave out size from the ID for an item in the db.

### possible tests

for api calls:
check that the schema of the response has not changed
for html:
check that the html tree is the same as before

# todo when back

- stricter type checking in scraper (e.g verify that product_data looks like we want)
- add more proxies, write infra for switching between data center and residential
- dive into logs
- implement a more robust logging system

### when adding new site currently

- Parser that implements 2 functions
- Transformer that implements 1 function

### TODO

- write some tests
- start designing web UI

### frontend

- should be possible to create an account with google
- view product, change model if you are logged in
- upload photo, train AI

### design

- a ui that's some combination of normal shopping and aggregation sites. VERY minimalistic.
  - black and white

### pages

- home
- search
  - airbnb search components are really good
- product

### inspiration

- launch page: https://www.airbnb.se/release

### small pivot

- app where users can train like lensa
- provide integration for shopping sites
  - barbershop also?

for a user:

1. create an avatar in our app
2. connect to our service from the shopping site/app
3. generate

for a website:

1. get contacted by us
2. integrate our SDK
3. now users can just click a button on the page to generate an image

Downstream effects:

- generated images are on the users profile in the app
  - content for a small niche social media play

### TODO

- fine tune realistic vision
  - everydream
