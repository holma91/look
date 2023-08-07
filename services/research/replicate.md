### Train dreambooth

**Commands to upload zip file**:

```
RESPONSE=$(curl -X POST -H "Authorization: Token $REPLICATE_API_TOKEN" https://dreambooth-api-experimental.replicate.com/v1/upload/data.zip)

curl -X PUT -H "Content-Type: application/zip" --upload-file data.zip "$(jq -r ".upload_url" <<< "$RESPONSE")"

SERVING_URL=$(jq -r ".serving_url" <<< $RESPONSE)
```

**Commands to start a training job**:

```
curl -X POST \
    -H "Authorization: Token $REPLICATE_API_TOKEN" \
    -d '{
            "input": {
                "instance_prompt": "a photo of a cjw person",
                "class_prompt": "a photo of a person",
                "instance_data": "'"$SERVING_URL"'",
                "max_train_steps": 2000
            },
            "model": "holma91/dbtest",
            "trainer_version": "cd3f925f7ab21afaef7d45224790eedbb837eeac40d22e8fefe015489ab644aa",
            "webhook_completed": "https://example.com/dreambooth-webhook"
        }' \
    https://dreambooth-api-experimental.replicate.com/v1/trainings
```

**Commands to run the uploaded model**:

```
curl -X POST \
    -H "Authorization: Token $REPLICATE_API_TOKEN" \
    -d '{
            "input": {
                "prompt": "painting of cjw by andy warhol"
            },
            "version": "f05ad4ce2912bcb6dadaa838b06f6a194b53b895df229f29c827694f567cc372"
        }' \
    https://api.replicate.com/v1/predictions
```

### Alternatives

**alt 1**:

- train models with replicate
- make predictions with replicate

**alt 2**:

- train models on our own
- upload models to replicate
- make predictions with replicate

Coldboots could be a problem if we choose to use Dreambooth.

## How does Replicate work?
