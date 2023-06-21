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

UserSchema = pydantic_model_creator(User)
WebsiteSchema = pydantic_model_creator(Website)