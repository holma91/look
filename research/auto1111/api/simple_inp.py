import json
import requests
import io
import base64
from PIL import Image

from settings import URL

payload = {
    "prompt": "RAW photo, photo of black woman, 8k uhd, dslr, soft lighting, high quality, film grain, Fujifilm XT3",
    "negative_prompt": "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime), text, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
    "sampler": "DPM++ 2M Karras",
    "steps": 25,
    "init_images": [],
    "mask": "",
    "width": 1024,
    "height": 1369,
    "inpaint_full_res": True,
    "inpaint_full_res_padding": 32,
    "inpainting_fill": 1,
}


def image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def main():
    image_base64 = image_to_base64("./images/testimage3.jpeg")
    mask_base64 = image_to_base64("./images/testmask3.png")

    payload["init_images"].append(image_base64)
    payload["mask"] = mask_base64

    response = requests.post(url=f"{URL}/sdapi/v1/img2img", json=payload)
    r = response.json()

    image = Image.open(io.BytesIO(base64.b64decode(r["images"][0])))
    image.save(f"./results/simple_inp.png")


if __name__ == "__main__":
    main()
