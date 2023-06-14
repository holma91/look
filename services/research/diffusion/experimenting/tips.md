## levelsio

cost per dreambooth fine-tune:

- $0.50-$3 per fine-tune
  is levelsio fine-tuning with everydream?
- a custom model called people-diffusion
- "You should train directly on Replicate with the Dreambooth trainer": https://replicate.com/replicate/dreambooth

- use face segmented images for dreambooth to avoid memorization of hair style
  - cut off hair, or cut of everything that is not face?

## dannypostmaa

- uses dreambooth with controlnet
- DALL-E inpainting?
- ESRGAN upscaling?
- automask eye and inpaint it?
- auto segmentation -> apply mask -> inpainting

from danny; the process of training:
Still trying out the details myself, but comes down to:

1. Heavily tuning DreamBooth parameters
2. Trying different class_data sets
3. DAYS worth of prompt testing.
