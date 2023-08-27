# High-resolution Image Synthesis with Latent Diffusion Models

### Abstract

The diffusion model operates in latent space instead of pixel space -> reaches a near optimal point between complexity reduction and detail preservation.

### Introduction

There seems to be a general goal that is to make diffusion models (DM) less computationally demanding. That's why the move from pixel space to latent space is so essential?

Learning can be roughly divided into two stages:

1. Perceptual compression
   removes high-frequency details but still learns a little semantic variation
2. Semantic compression
   learns the semantic and conceptual composition of the data

Seems like LDMs are better at Semantic compression while Autoencoder+GANs are better at perceptual compression?
