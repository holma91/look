### Misc

CLIP basically takes the text and returns a vector (embedding) that represents the text as an image.

### Video comments

12 steps first in the KSampler to "roughen in what I want, and not get the extra arms and stuff"
why do we upscale the latents?

we have 2 samplers, do first 12 steps on number 1, last 8 steps on number 2.

Can use "efficiency nodes" to add some abstractions to the UI.

### Diffusion with offset noise

Fine-tuning against a modified noise, enables Stable Diffusion to generate very dark or light images easily.

Stable diffusion has a problem with generating particularly light or dark images, it almost always generate images whose average value is relatively close to 0.5.
