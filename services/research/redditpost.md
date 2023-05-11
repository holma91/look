### Thoughts and Questions after trying LoRA and Dreambooth

My goal is to be able to generate images of myself with Stable Diffusion, and Realistic Vision 2.0 in particular.

As a baseline, I want to be able to generate as good of images of myself as I can do with celebrities in RV2.0 without any LoRA or fine-tuning. Example of prompt that will generate very good images of celebrities in RV2.0:

```txt
photo of Brad Pitt, highlight hair, model photography, rim lighting, studio lighting, looking at the camera, dslr, ultra quality, sharp focus, tack sharp, dof, film grain, Fujifilm XT3, crystal clear, 8K UHD, highly detailed glossy eyes, high detailed skin, skin pores
```

And negative prompt:

```txt
disfigured, ugly, bad, immature, cartoon, anime, 3d, painting, b&w
```

And if I wanna create some kind of custom character with brad pittyness, I can do [man: Brad Pitt: 0.25] etc. You can change the celebrity to anyone and you will get similar results.

I get really good results with this, and I can essentially inpaint any celebrity to whatever image I want. It works good up-close but also for full-body-shots.

So, since this is possible with celebs, it should be possible to do for any arbitrary person if by using LoRA or Dreambooth, right? My assumption is that I should be able to get as good of results for me as I get with Brad Pitt or whatever celebrity, if I train the LoRA and/or Dreambooth correctly.

Problem is that I don't get results that are as good. So I'm starting to question if the assumption is true. Maybe it's not possible to modify the model so that it will be able to generate a random dude as good as it can generate celebrities? Even if I provide great training images. Maybe I haven't done that so far though, I have ~20 selfies and 5 full-body-shot. Especially images in the distance gets complete trash. Maybe because I don't have enough full-body-shots? Maybe there is room for some data augmentation here. Should be possible to synthetically generate a bunch of images in the distance from selfies.

Anyway, what are your experiences with Dreambooth and LoRA in general? What tips do you have? I'm mostly interested in photorealistic stuff, and that's why I most often use realistic vision 2.0 as my base model. Also interested in knowing if you agree with my assumption about celebrity image quality vs <person-you-train-on> image quality.
