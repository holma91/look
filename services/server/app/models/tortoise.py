from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator

class TextSummary(models.Model):
    url = fields.TextField()
    summary = fields.TextField()
    created_at = fields.DatetimeField(auto_now_add=True)

    def __str__(self):
        return self.url


SummarySchema = pydantic_model_creator(TextSummary) # generates a Pydantic model from a Tortoise model

############### LOOK ###############

class User(models.Model):
    id = fields.TextField(pk=True)
    favorites = fields.ManyToManyField(
        'models.Website', related_name='users', through='user_website'
    )

class Website(models.Model):
    domain = fields.TextField()
    multi_brand = fields.BooleanField()
    second_hand = fields.BooleanField()

UserSchema = pydantic_model_creator(User)
WebsiteSchema = pydantic_model_creator(Website)