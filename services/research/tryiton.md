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

### demo

So this is Look, and as you can see, we are unifying physical and digital shopping. Let's get started.

Here we see some base models. These people do not exist. To customize the experience, let's create a model of myself.

We now have to wait for the model to be trained. Meanwhile, we can go shopping

Here you can some selected websites, we can star if them we want. Let's visit Loro Piana.

Alright so when we are at a product, the product information gets extracted here. Black man is the default model that we selected earlier.

Now lets choose a product and try it on our model

Now lets go look if the model of myself is finished.

There we have it, with a generated headshot. Now lets try it. I found a sweater I liked earlier that we could try. It should be in the history somewhere

Here we have it, from softgoat. Let's try it. Alright, now we can share this fit with other users.

So here we can see different generations from the same product likes this.

I like this hoodie I'm seeing at the top right, let's try it and maybe buy it aswell.

And there we go, that's the demo, I hope you liked it!
