select * from user_product up
join product p on up.product_url = p.url
join product_image pi on p.url = pi.product_url
join website w on p.domain = w.domain
join list_product lp on up.product_url = p.url
where up.user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV';

select count(*) from user_product up
join product p on up.product_url = p.url
join product_image pi on p.url = pi.product_url
join website w on p.domain = w.domain
join list_product lp on up.product_url = p.url
where up.user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV';

select * from user_product up
join product p on up.product_url = p.url
join list_product lp on up.product_url = p.url
where up.user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV'
and lp.list_id = 'likes';

select count(*) from user_product up
join product p on up.product_url = p.url
join list_product lp on up.product_url = p.url
where up.user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV'
and lp.list_id = 'likes';

select * from user_product up
join list_product lp on lp.product_url = up.product_url
where up.user_id = 'user_2RYsQv4W7NG9YYHaOId6Tq599SV';