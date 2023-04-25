item_id: brand:item_id

1. get all listings from api url
   The reason for this step is to get the product urls. After this step, we have all product urls.
2. go through all product urls and extract relevant data
   Does it by getting the html, extracting the schema.org stuff and maybe something else.
3. insert into database
   if something has changed since the last insert (compare by item_id), insert into the database
