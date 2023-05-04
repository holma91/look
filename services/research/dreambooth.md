## Tests

alex0.ckpt: sd1.5, 10 selfies, no prior preservation:

- face is weird on full body shots
- face is decent on up close shots
- eyes are weird on all shots
- inpainting replacement is decent BUT very bad face
- for inpainting, better to do large part of image than ONLY head (because of background issue, rough edges)

alex1.ckpt: sd1.5, 20 selfies, 5 full-body-shots, no prior preservation:

- basically no difference to alex0.ckpt

### notes

- lower CFG gives less fcked up skin
- "restore faces" gives a little less fcked up eyes

### generate realistic stuff

https://stable-diffusion-art.com/realistic-people/
https://www.youtube.com/watch?v=TpuDOsuKIBo

getting best results with DPM++ 2M Karras I think.

prompt scheduling: [keyword1 : keyword2: factor] e.g Oil painting portrait of [Joe Biden: Donald Trump: 0.5].

custom photorealistic models:

- realistic vision 2.0

  - Getting best results with this one.
    inpainting:
    - still difficult to swap out head.
    - easier to swap out face
    - "restore faces" is decent when I try but removes detail
      - basically airbrushes it
  - go into rv more in depth
  - negative prompting fixes the eyes

- realistic vision 2.0 INPAINTING

  - interesting results with head swap
    - with "masked only"
  - swapping faces works good
  - BEST! only masked, not restore face
    photo of [woman: Margot Robbie: 0.25], highlight hair, model photography, wearing dress, rim lighting, studio lighting, looking at the camera, dslr, ultra quality, sharp focus, tack sharp, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD, highly detailed glossy eyes, high detailed skin, skin pores

- dreamlike photoreal 2.0

**Inpaint area has two options:**

- Whole picture:
  This is the default option. Stable Diffusion will generate new output images based on the entire input image, then blend those output images into the designated inpaint area based on the amount of mask blur you specified.
- Only masked:
  If you select this option, Stable Diffusion will upscale just the areas you designated to the width and height you set, generate based on that, then downscale those back to the original size and combine them into the output image. If the area you’re inpainting is very small in proportion to the entire image, this is a great option to select because sometimes Stable Diffusion’s inpaint will fail and return no change to the output otherwise. If you select this option, then you should also designate how much only masked padding in pixels you want. Your output will look more like the input the higher the masked padding value you set.

### samplers
