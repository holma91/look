import json
import requests
import io
import base64
from PIL import Image

from settings import URL

payload = {"prompt": "photo of a person, outside restaurant", "steps": 20}

response = requests.post(url=f"{URL}/sdapi/v1/txt2img", json=payload)
r = response.json()

image = Image.open(io.BytesIO(base64.b64decode(r["images"][0])))
image.save("output.png")
