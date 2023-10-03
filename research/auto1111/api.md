What happens when we generate an image?
Via GUI:

1. modules/txt2img.py:txt2img is called.
2. it calls the run method on a scripts.py:ScriptRunner.

### Inpainting

inpainting_fill: fill, original, latent noise, latent nothing (0, 1, 2, 3)

### notes

https://github.com/AUTOMATIC1111/stable-diffusion-webui/discussions/3734

swap model by calling v1/options
then call v1/txt2img to make prediction.

The most important function is processing.py:process_images_inner

some stuff comes from "shared":

- the model
