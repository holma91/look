import json
import requests
import io
import base64
from PIL import Image

URL = "https://1dxi3jiqbumkmr-3001.proxy.runpod.net"

payload = {"prompt": "cavapoo puppy", "steps": 15}

response = requests.post(url=f"{URL}/sdapi/v1/txt2img", json=payload)
r = response.json()

image = Image.open(io.BytesIO(base64.b64decode(r["images"][0])))
image.save("output.png")
