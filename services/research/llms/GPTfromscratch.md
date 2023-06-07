Dataset: All of Shakespeare

**Encoder**: takes a string, outputs a list of integers
**Decoder**: takes a list of integers, outputs a string

Possible to encode in different ways, e.g by character, by word chunk, or what tiktoken is doing. We are using a "character level tokenizer" here. Because of this, we get a small vocab (every occuring char) and long integer sequences. E.g "hii there" => `[46, 47, 47, 1, 58, 46, 43, 56, 43]`.

We encode the whole dataset, and just get a massive sequence of integers.

We only work with chunks of the dataset, that we sample when we train the NN. The size of these samples are called `block_size` by Karpathy.

For an integer sequence `[18, 47, 56, 57, 58, 1, 15, 47, 58]`
`when input is tensor([18]) the target is 47`
`when input is tensor([18, 47]) the target is 56`
`when input is tensor([18, 47, 56]) the target is 57`
`...
This just means that the NN should predict the next integer in the sequence.

This train the transformer into being able to make predictions with different context lengths.

This is called the time dimension of the tensors we are going to feed into the transformer. The other dimension is the **batch dimension**:

When we feed something into the transformer, we are going to have many batches (of multiple chunks of text) put into the same tensor. It's done for efficiency reason (we wanna utilize the GPU).

**bigram language model**:
a type of statistical language model that predicts the probability of a word in a sequence based on the previous word.

Watched the first 25 minutes.

### Questions

How do we measure loss with word predictors? Looks like every prediction has a target, just like with other NNs.
