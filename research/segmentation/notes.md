sam is doing everything in two steps.

1. SamPredictor.set_image() to calculate the image embedding
   - calls Sam.preprocess()
   - sets `self.features = image_encoder(input_image)`, which is the embeddings
2. SamPredictor.predict() to predict the image masks. We get back
   - masks
   - scores
   - logits

SAM is composed of three main parts:

- image_encoder
  Encodes the input image into a set of image embeddings (that are later used for mask prediction)
- prompt_encoder
  Encodes the prompts (boxes, points) into a format that can be used for mask prediction
- mask_decoder
  Generates object masks based on the image embeddings from the image_encoder and the prompt embeddings from the prompt_encoder.

Everything is initialized in build_sam.py.

### Terms

The term "image embedding" refers to the transformation of raw image data into a lower-dimensional form that captures the essential information in the image.

**logits**:
In deep learning, the logits are the net inputs of the last neuron layer. It's what we get BEFORE applying the activation function.
