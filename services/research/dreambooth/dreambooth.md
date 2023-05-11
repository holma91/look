## Initial tests

alex0.ckpt: sd1.5, 10 selfies, no prior preservation:

- face is weird on full body shots
- face is decent on up close shots
- eyes are weird on all shots
- inpainting replacement is decent BUT very bad face
- for inpainting, better to do large part of image than ONLY head (because of background issue, rough edges)

alex1.ckpt: sd1.5, 20 selfies, 5 full-body-shots, no prior preservation:

- basically no difference to alex0.ckpt
- lower CFG gives less fcked up skin
- "restore faces" gives a little less fcked up eyes

## In-depth

article by huggingface: https://huggingface.co/blog/dreambooth

**TLDR: Recommended settings**:

- low LR, progressively increase number of training steps.
- DB needs more steps for faces, 800-1200 steps works well with batch size 2 and LR of 1e-6.
- Prior preservation is important to avoid overfitting when training on faces.
- If the generated images are noisy, use the DDIM scheduler or run more inference steps (~100)
- Training the text encoder in addition to the UNet has a big impact on quality.
  - however fine-tuning the text encoder requires more memory, (GPU with at least 24GB of RAM)
    - might be possible to train on 16gb by using 8-bit Adam, fp16 or gradient accumulation.
- fine-tuning with or without EMA produced similar results.

Color artefacts are noise remnants. Running more inference steps can help resolve that.

Faces are harder to train. In our experiments, a learning rate of 2e-6 with 400 training steps works well for objects but faces required 1e-6 (or 2e-6) with ~1200 steps.

Image quality degrades a lot if the model overfits, and this happens if:

- The learning rate is too high.
- We run too many training steps.
- In the case of faces, when no prior preservation is used, as shown in the next section.

Seems like DDM is the preferred scheduler.

### Tutorial with Filewords

https://phantom.land/work/dreambooth-training-better-results

### Test

Not using captioning on either.

Train myself on top of Realistic Vision 2.0 (using default params in Kohya colab)

- misses the mark completely, images barely resembles me...

Train myself on top of Stable Diffusion 1.5 (Using recommended params by huggingface)

- decent when doing "[man: <alex>: 0.2]" and "[<alex>: Brad Pitt: 0.75]" type prompting
- inpainting also works decent doing the above style prompting
