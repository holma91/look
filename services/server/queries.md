abstract_item.id: brand:product_id
item.id: website:brand:product_id

for currency codes, follow: ISO 4217
for country codes, follow: ISO 3166-1 alpha-2

for categories: lower case with dashes instead of space e.g Ready To Wear -> ready-to-wear
gender: man/woman/

```sql
select * from abstract_item ai
join item i on i.abstract_item_id = ai.id
join item_color ic on ic.item_id = i.id
join color c on c.id = ic.color_id
join item_image ii on ii.item_id = i.id
join image on image.id = ii.image_id
join item_category ica on ica.item_id = i.id
join category ca on ca.id = ica.category_id
join item_size is on is.item_id = i.id
join size s on s.id = is.size_id;
```
