# Understanding Variational Autoencoders - VAEs

Notes from the following blog post: https://towardsdatascience.com/understanding-variational-autoencoders-vaes-f70510919f73

Variational autoencoders are regularised versions of autoencoders.

**dimensionality reduction**: the process of reducing the number of features that describe some data

encoder: the process that produce the "new features" representation from the "old features" representation
decoder: the reverse process of the above

Dimensionality reduction can then be interpreted as data compression where the encoder compress the data (from the initial space to the encoded space, also called latent space) whereas the decoder decompress them. This compression can be lossy.

The main purpose of a dimensionality reduction method is to find the best encoder/decoder pair among a given family. We ofc want to keep the maximum amount of information when encoding AND have the smallest possible reconstruction error when decoding.

**Principal components analysis (PCA)**
A method for dimensionality reduction. "Looks for the best linear subspace using linear algebra".

## Autoencoders

How can we use neural networks for dimensionality reduction?

The general idea of autoencoders consists in setting an encoder and a decoder as neural networks and to learn the best encoding-decoding scheme using an iterative optimisation process

"autoencoder architecture" refers to encoder+decoder.

The search of encoder and decoder that minimise the reconstruction error is done by gradient descent over the parameters of these networks.

## Variational Autoencoders

We have discussed the dimensionality reduction problem and introduced autoencoders that are encoder-decoder architectures that can be trained by gradient descent. With these autoencoders, we have no way to produce any new content.

Why can't we take a point randomly from the latent space, and decode it to get new content (the decoder would kinda act like the generator of a GAN)?

It is pretty difficult (if not impossible) to ensure, a priori, that the encoder will organize the latent space in a smart way compatible with the generative process we just described.

The autoencoder is solely trained to encode and decode with as few loss as possible, no matter how the latent space is organised. The network will take advantage of any overfitting possibilities to achieve its task as well as it can unless we explicitly regularise it.

So, we need to figure out a way to use the decoder of our autoencoder for generative purposes. To be able to do that we need to make sure that the latent space is regular enough.

A Variational Autoencoder can be defined as a an autoencoder whose training is regularized to avoid overfitting and ensure that the latent space has good properties that enable a generative process.

Just as a standard autoencoder, a variational autoencoder is an architecture composed of both an encoder and a decoder and that is trained to minimise the reconstruction error between the encoded-decoded data and the initial data.

**so what's the difference?**
To introduce some regularization of the latent space, instead of encoding an input as a single point, we encode it as a distribution over the latent space. The model is then trained as follows:

1. the input is encoded as a distribution over the latent space
2. a point from the latent space is sampled from that distribution
3. the sampled point is decoded and the reconstruction error can be computed
4. the reconstruction error is backpropagated through the network

The reason why an input is encoded as a distribution with some variance instead of a single point is that it makes it possible to express very naturally the latent space regularisation: the distributions returned by the encoder are enforced to be close to a standard normal distribution.

In VAEs, the loss function is composed of a

- reconstruction term
  makes encoding-decoding scheme efficient
- regularisation term (expressed as a Kulback-Leibler divergence)
  makes the latent space regular

### Intuitions about the regularisation

The regularity that is expected from the latent space in order to make generative process possible can be expressed through two main properties:

- continuity
  two close points in the latent space should give similar contents once decoded
- completeness
  a point sampled from the latent space should give "meaningful" content once decoded

There is a tradeoff between regularization and reconstruction loss.

### Takeaways

- dimensionality reduction is the process of reducing the number of features that describe some data. Can be seen as an encoding process.
- autoencoders are neural networks architectures composed of both an encoder and a decoder.
- variational autoencoders (VAEs) are autoencoders that tackle the problem of the latent space irregularity by making the encoder return a distribution over the latent space instead of a single point

the loss function of VAEs, can be carefully derived using in particular the statistical technique of variational inference (hence the name “variational” autoencoders!).

# Why VAE are likelihood-based generative models

Notes from the following blog post: https://towardsdatascience.com/why-vae-are-likelihood-based-generative-models-2670dd81a40

**what's a likelihood based model?**
A class of generative model that model the distribution of the data directly with a likelihood function. Most popular example of one is VAE.
