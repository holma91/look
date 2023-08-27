# BENCHMARKING

positive base prompt: MODEL SPECIFICS, model photography, stunningly beautiful, rim lighting, studio lighting, looking at the camera, dslr, ultra quality, sharp focus, tack sharp, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD, highly detailed glossy eyes, high detailed skin, skin pores
negative prompt: disfigured, ugly, bad, immature, cartoon, anime, 3d, painting, b&w

Example of the prompt when using a LoRA: `photo of sks woman, model photography, stunningly beautiful, rim lighting, studio lighting, looking at the camera, dslr, ultra quality, sharp focus, tack sharp, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD, highly detailed glossy eyes, high detailed skin, skin pores, <lora:lora_taylor_v1_from_v1_160:1.5>`

We segment every thing except the clothes. We then replace the rest with another model.

### USING RV2.0-inpainting

1. [woman: Scarlett Johansen: 0.1]

2. `<lora:lora_taylor_v1_from_v1_160:1>`
   Doesn't really get the resemblance.

3. `<lora:locon_aubrey_v2_from_v1_64_32:1>`
   LyCoris doesn't load in the UI rn.

4. `<lora:locon_sophie_v1_from_v1_64_32:1>`
