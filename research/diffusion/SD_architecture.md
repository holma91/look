# Stable Diffusion Architecture

notes from https://towardsdatascience.com/stable-diffusion-best-open-source-version-of-dall-e-2-ebcdf1cb64bc

SD is an open source implementation of the Latent Diffusion architecture.

The autoencoder used in Stable Diffusion has a reduction factor of 8. This means that an image of shape (3, 512, 512) becomes (3, 64, 64) in latent space, which requires 8 × 8 = 64 times less memory.

Three main components:

1. The Autoencoder.
   Uses the VAE architecture which consists of a encoder and a decoder. Encoder is used during training to convert the sample into a lower dimensional latent representation. On inference, the denoised, generated samples undergo reverse diffusion in the decoder where they are transformed back to their original dimensions.

2. U-Net.
   Comprised of ResNet. It receives the noisy sample in a lower latency space (together with conditioning text), compresses it, and then decodes (decompresses?) it back with less noise. The predicted noise from the UNet is used to denoise the sample.

3. Text Encoder.
   Is responsible for the text processing, it transforms the prompt into an embedding space.

### CLIP Text encoder

We give the UNet "guidance" on how to remove the noise.
We want a model that can take the words "a cute teddy" and turn it into a vector with numbers that represent a cute teddy.

We create 2 neural nets:

1. textencoder
   takes text as input e.g "A graceful swan" and turns it into a vector of numbers.
2. imageencoder
   takes an image as input e.g a picture of "A graceful swan" and turns it into a vector of numbers.

We want these two vectors to be similar! We measure this similarity by taking the dot product of the two vectors, and the larger the dot product is, the more similar the two vectors should be. What we are doing here is the "contrastive loss".

Together the textencoder and imageencoder creates a multimodal model. This model is CLIP.
The vector of numbers that is the output of the textencoder is the "conditioning text" that goes into the UNet!

So, the input to CLIP is text and the output is an embedding (a vector of numbers). Similar text should produce similar embeddings!

### "timesteps"

Every time we create a batch of size n for training:

- randomly pick n images
- randombly pick an amount of noise OR randomly pick a t (time step) and look up the corresponding noise
- use that amount of noise for each of the n images

At inference time, the image will start with as much noise as possible, which means that the timestep t will be zero.
I think this is what happens:

- the UNet predicts the noise at timestep t, multiplies the predicted noise with a constant C
- it then sets `t = t + 1` and keeps going until t is equal to a predefined value (total number of steps).

What do we use for C? How do we go from the prediction of noise to the thing we subtract? These are all things that are decided by the "diffusion sampler".

PS:

- In "deep learning optimizers", the C is called the learning rate.
  - "momentum" and "adam" are types of optimizers

### Confusion around VAE vs UNet

Autoencoder is something that gives us back what we gave it. It's interesting because we can split it into a encoder and a decoder. The encoder is a neural net, and the decoder is also a neural net.

The encoder compresses the image down to a lower dimensional latent space. The UNet is then trained on the compressed image! It's the fact that the UNet right here is operating in latent space instead of pixel space that makes SD more computationally efficient.

So, the input to the UNet is "somewhat noisy latents". The output is the noise. We subtract the noise from the "somewhat noisy latents" which gives us the actual latents.

We take the output of the UNet (which is a latent representation of an image), put it through the decoder and gets back an image in our actual pixel space.

The VAE is basically just the thing that takes us in and out from latent space. It's entirely optional, and you can throw it away if you instead want the UNet to operate in the full pixel space. We want to operate in latent space because it's much more efficient.
