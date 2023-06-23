from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator


class User(models.Model):
    id = fields.TextField(pk=True)
    favorites = fields.ManyToManyField(
        'models.Website', related_name='users', through='user_website'
    )

class Website(models.Model):
    domain = fields.TextField(pk=True)
    multi_brand = fields.BooleanField()
    second_hand = fields.BooleanField()

class Product(models.Model):
    product_url = fields.TextField(pk=True)
    website = fields.ForeignKeyField('models.Website', related_name='products')
    brand = fields.TextField()
    name = fields.TextField()
    price = fields.FloatField()
    currency = fields.TextField()
    updated_at = fields.DatetimeField(auto_now=True)


UserSchema = pydantic_model_creator(User)
WebsiteSchema = pydantic_model_creator(Website)