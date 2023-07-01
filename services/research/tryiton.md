# High-level approach

Object detection -> Segmentation -> Diffusion

### Current state

Person Box together with negative points on head:

- works on demo UI
- for some reason having problems in the notebook
- works if we had positive points on the clothes

### TODO

- chill out with the segmentation for 1-3 days
- implement UI

## Characters

end of positive prompt `model photography, stunningly beautiful, rim lighting, studio lighting, dslr, ultra quality, sharp focus, tack sharp, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD, highly detailed glossy eyes, high detailed skin, skin pores`
negative prompt for all: `disfigured, nfsw, naked, ugly, bad, immature, cartoon, anime, 3d, painting, b&w`

settings variation: `in kitchen`

**blonde white woman**:
prompt: [woman: Leonardo Dicaprio: 0.75], blonde hair,
seed: 1000

**brunette white woman**:
prompt: [woman: Leonardo Dicaprio: 0.75], brown hair,
seed: 2000

**brunette white man**:
prompt: [man: Ana de Armas: 0.75], model photography, brown short hair
seed: 3000
