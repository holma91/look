**Why are there separate checkpoints for inpainting?**
On top of the normal model training, the following is done: 440k steps of inpainting training at resolution 512x512 on “laion-aesthetics v2 5+” and 10% dropping of the text-conditioning. For inpainting, the UNet has 5 additional input channels (4 for the encoded masked-image and 1 for the mask itself) whose weights were zero-initialized after restoring the non-inpainting checkpoint. During training, we generate synthetic masks and in 25% mask everything.

### prompt

you can reuse the original prompt for fixing defects

### face restoration

turn on "restore faces" if you want. Can however generate inconsistent looks.

### Masked content

original: the result is guided by the color and shape of the original content (is often used for faces)
latent noise or latent nothing: generate something completely different than the original content (good for e.g removing limbs)

### Denoising strength

How much will it change compared to the original image? 0.75 is a good starting point.

### Observations

Latent noise and latent nothing good for adding an object such as a hat.

## Changing skin colour

possible to change skin colour on legs with rv2-inpaint.

1. swap out body parts that are not the head
2. then swap out the head or face
