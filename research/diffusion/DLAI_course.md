## DeepLearning.ai Diffusion Model course

### Sampling

"What we do with the neural network after it's trained, at inference time"

**diffusion hyperparameters**:

- timesteps (500 ish)
- beta1 and beta2 (controls how much noise is added at each step)

DDPM is a model:

- not a sampler (or is it? it sometimes referred to as one)
- not a scheduler
  But:
  - it includes a sampling process
  - it includes a noise scheduler

To summarize, a DDPM is a type of generative model that can generate new samples from a learned distribution.

In the visualized example, we start with 32 images that just looks like noise. Gradually, the noise gets removed according to the noise scheduler, and in the end we have 32 good looking images. The DDPM generated samples from a learned distribution (?).

The neural net expects a normally distributed noisy sample as input.

Important: We don't only remove noise at each step, we also add some random extra noise. This helps "stabilizing" the network, and when we don't do it the results looks like just average blobs of the image dataset.

### The neural network

For diffusion models, we use a UNet.

- input: an image of size x
- output: predicted noise of size x

In the upsampling blocks, we can EMBED more information.

- time embedding
- context embedding
  Related to controlling the generation! E.g the prompt. So, the context embedding helps controll what the model generates.

### Training

NN learns to predict noise - really learns the distribution of what is not noise.

Take an image, add noise to it, ask the neural network to predict the noise, and the compare the predicted noise with the actual noise to get the loss.

In addition to diffusion hyperparams and network hyperparams, we now also have **training hyperparameters**:

- batch_size: the number of training examples utilized in one iteration. I think this means that the MSE will be calculated on a batch, that we then do gradient descent on.
- n_epoch: the number of complete passes through the entire training dataset. If 32, the network will see every example in the training dataset 32 times before it's finished.
- learning_rate

### Controlling

"Embeddings are vectors that captures meaning"

Embeddings can capture the semantic meaning of words, so for example the following works (~ish):
`Paris - France + England = London`.

When sampling, the NN gets the text embedding (from the prompt) as input along with random noise. It then takes the text embedding into consideration when predicting the noise, and predicts the noise that when removed will make the image look like what's explained by the embedding.

A vector that's one-hot encoded contains 1 one and the rest zeros.

### Speeding up

DDIM is 10x more efficient than DDPM. It's faster because it's able to skip timesteps. It predicts a rough sketch of the final output and then refines it with the denoising process. Could sometimes get worse quality. Empirically, with the model trained on 500 steps, DDPM does better if you sample for all the 500 steps, but DDIM does better if you sample for less.

### More

Stable diffusion uses "Latent diffusion", which operates on image embeddings instead of images directly.
