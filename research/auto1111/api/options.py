import json
import requests

from settings import URL


SD_v1_5 = "v1-5-pruned.ckpt"
RV_v5_1_NO_VAE = "Realistic_Vision_V5.1_fp16-no-ema.safetensors"

option_payload = {
    "sd_model_checkpoint": RV_v5_1_NO_VAE,
}

response = requests.post(url=f"{URL}/sdapi/v1/options", json=option_payload)

r = response.json()
print(json.dumps(r, indent=4))
