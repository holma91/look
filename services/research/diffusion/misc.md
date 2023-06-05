## SD Deep Dive Notebook

tokenizer and scheduler on the CPU.
vae, unet and text_encoder on the GPU.

Number of inference steps IS the number of timesteps in the scheduler.

**The Scheduler**:
During sampling (inference), we want to denoise over a number of steps. How many steps and how much noise we should aim for at each step are going to affect the final result, and it's the scheduler that's in charge of these details.

scheduler.timesteps gives us the list of timesteps while scheduler.sigma gives us the corresponding noise. Remember the plot of the noise schedule with timesteps at the x-axis and noise at the y-axis. We follow the noise schedule to gradually denoise down to an image.

**img2img**:
We start with the encoded parrot image. First 10 steps do nothing, last 40 steps remove noise conditioned by the text "A colorful dancer, nat geo photo". If we increase the start steps, the image looks more like a parrot and less if we decrease.

so maybe this is what happens when we do img2img?

1. the input image gets encoded into a latent representation
2. after a certain number of steps, noise from the encoded input image gets removed conditioned by the prompt

It's the same as for text2img, it's just that we skip the first few steps and start from a noised image (the encoded input) rather than pure noise.

**embeddings**:
The output embeddings we get from the text_encoder(tokens) is what we feed the model as conditioning.
The tokens are transformed into a set of input embeddings, which are then fed through the transformer model (?) to get the final output embeddings.

two different types of input embeddings:

- token_embedding
  Every token gets mapped to a 768-dimensional vector - the token embedding
- position_embedding
  Tell the model where in a sequence a token is. We just need one for every position, not one for every token.

To get the final input embedding, we just do `token_embedding + position_embedding`. We then put the joint embedding through the transformer (CLIP?), and get the final output embeddings.

We can take an embedding for x and swap it with an embedding for y, like we did with dog and cat in the notebook. We can also average the embeddings of two different prompts, and create an embedding that represents a mixture of a dog and a cat.

**textual inversion**:
Learn a new concept, a few example images are used to create a new token embedding.

**UNet**:
What it looks like when we we make a noise prediction:
`noise_pred = unet(latents, t, encoder_hidden_states=text_embeddings)["sample"]`
From that we can see that the UNet takes in the noisy latents, the timestep and our text embedding. It then outputs the noise prediction.

We can remove the predicted noise by doing `latents_x0 = latents - sigma * noise_pred`. But we add most of the noise back to this predicted output, and let the UNet remove more of it in the next diffusion step.

**Classifer Free Guidance (CFG)**
blank prompt generates unconditional embeddings. By doing `noise_pred_uncond, noise_pred_text = noise_pred.chunk(2)`, we see that we have two predictions. noise_pred_uncond is the prediction with the unconditional embeddings. noise_pred_text the prediction with our text embedding (derived from actual prompt). The final prediction is given by `noise_pred = noise_pred_uncond + guidance_scale * (noise_pred_text - noise_pred_uncond)`. We can here see that a higher guidance scale results in our prediction caring more about the text_embedding, our prompt.

**Guidance**
How can we add some extra control to the generation process?

At each step, we're going to use our model as before to predict the noise component of x. Then we'll use this to produce a predicted output image, and apply some loss function to this image.

This function can be anything. If we want images that have a lot of blue, we can craft a loss function that gives a high loss if pixels have a low blue component.

So, in theory at this step we can make the model optimize for all sort of things? Like "human-ness".

**Sampling explanation**
Manifold theory? "For a dataset of images, these are gonna lie on some lower dimensional manifold within this higher dimensional space".

The process of gradually corrupting our images away, adding noise one piece at a time, can be modelled with a stochastic differential equation. So, how do we then go back to the original image? That is framed as solving an ODE. This is what these samplers are trying to do, solve this ODE to an original image. For example, Eulers method can be used. So, the usual way to think about the samplers is as ODE solvers basically?
