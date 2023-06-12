# mentioned probabilites/stats concepts

- density function
- probability distributions
- expected value

## Stable Diffusion Deep Dive Notebook

### Lesson 10

Imagic paper

- take an image of a thing and change what it's doing

### Lesson 11

DiffEdit paper

- semantic image editing
  - very relevant to what I'm doing

### Lesson 12

**CLIP Interrogator**
Give it an image, get back a prompt that somewhat describes the image.

- does not return the actual text that generates the photo
  The CLIP image encoder takes an input image and return a text embedding. Then inverse function does not exist (probably). You cannot go from the text embedding to an image. We don't have an "inverse of the clip encoder".

BLIP has been trained to give an "ok-ish" caption of an image.

**Einstein summation**:
"An extremely general way to perform tensor operations". Notability for the math.

### Lesson 13-14

Covers more fundamental Neural Network concepts. Don't have time for this right now.

### Lesson 15 - Goes through CNNs and Autoencoders (which contains CNNs)

Don't have time for this right now.

### Lesson 16 - Builds the learner in the training framework

Don't have times for this right now.

### Lesson 17 - Normalization, regularization and stuff

Don't have times for this right now.

### Lesson 18 - Accelerated SGDs and ResNets

Don't have times for this right now.

### Lesson 19 - DDPM and Dropout

**Dropout**:
Randomly delete some activations. We only do this at training time ofc. A pretty common place to add dropout is before the last linear layer.

**DDPM**:
"Does not have the latent VAE thing or conditioning". So, we are going to do "unconditional DDPM" from scratch.

### Lesson 20 - Mixed Precision

Don't have times for this right now.

### Lesson 21 - DDIM

**Experiment Tracking (WandB)**:

### Learning to do

- LORAs in depth.
- controlnet
- fine-tune something
- continue from this one: https://course.fast.ai/Lessons/lesson15.html
