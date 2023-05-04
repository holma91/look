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
  - still difficult to swap out head with inpainting.
  - go into rv more in depth
- dreamlike photoreal 2.0

### samplers
