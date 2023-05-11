Dreambooth: 2-7GBs
Textual inversion: 100kb
LoRA: 2-200MB

### How does LoRA work?

LoRA applies small changes to the most critical part of Stable Diffusion models: The cross-attention layers. It is the part of the model where the image and the prompt meet.

The weights of a cross-attention layer are arranged in matrices. A LoRA model fine-tunes a model by adding its weights to these matrices.

The trick of LoRA is breaking a matrix into two smaller (low-rank) matrices, hence low-rank adaptation.

### How to use LoRA models

Add the LoRA models to: stable-diffusion-webui/models/Lora

add the following to the prompt: <lora:filename:multiplier>

add the following to the prompt: <lora:filename:multiplier>

filename is the file name of the LoRA model, excluding the extension (.pt, .bin, etc).
multiplier is the weight applied to the LoRA model. The default is 1. Setting it to 0 disables the model.

### Generate Studio Quality Realistic Photos By Kohya LoRA Stable Diffusion Training - Full Tutorial

https://www.youtube.com/watch?v=TpuDOsuKIBo&t=18s

- generate a bunch of regularization images

Training images: 14

Repeats: 40
With Kohya_ss, it means that it will train each image 40 times and it will count that as 1 epoch.

Train: 12 Epochs

1 epoch will have 14\*40=560 steps.

Batch size: 1

total steps = 14 \* 40 / 1 \* 12 = 6720

Regularization Images: 560
number of regularization images I need = training images \* repeats

Currently I just generate them in a1111 with the config I normally use.
prompt: "photo of a man" OR "photo of blonde man" OR "photo of red-hair man" OR "photo of black man" OR "photo of a man, full-body"

Batch size: how many images to generate
Batch count: how many images to generate at once, can make you run out of memory very fast

Hires. fix pretty interesting.
I think Danny Postma goes heavy here.
DPM++ 2M Karras works the best
Higher network_dim results in a larger LoRA file.
Can choose between sampling during training or using xyz plot afterwards.

RV2-inpainting is clearly better on inpainting than RV-2.

**Alex_LoRA2**
network_dim = 128
network_alpha = 128
images = 14
reg_images = 560
repeats = 10
epochs = 10
batch_size = 6
total_steps = 14 \* 10 / 6 \* 10 = 233
Results: Doesn't look like me at all. Otherwise it's decents. Not good for inpainting on images far away.

The following all use the same 14 training images.

**Alex_LoRA3**:
base_model = RV2
network_dim = 128
network_alpha = 128
images = 14
reg_images = 0
repeats = 40
epochs = 12
batch_size = 1
total_steps = 6720
Results: Looks overtrained AF.

**Alex_LoRA4**:
base_model = RV2
same as Alex_LoRA3 but with network_alpha = 1
Results: Doesn't look like me at all.

**Alex_LoRA5**:
base_model = RV2
same as Alex_LoRA3 but with train_batch_size = 6
Results: Doesn't really look like me either.

**Alex_LoRA6**:
base_model = SD1.5
otherwise, same as Alex_LoRA5.
Results: a little better maybe.

**Alex_LoRA7**:
base_model = RV2
network_dim = 128
network_alpha = 128
batch_size = 3
images = 25
reg_images = 100
Results: Bad AF. Some images have no similarity at all, and some are overtrained AF.

**Alex_LoRA8**:
base_model = RV2
network_dim = 8
network_alpha = 1
repeats = 50
batch_size = 2
images = 25
reg_images = 0
Results: Absolute trash. Constructing the input images almost completely.

**Alex_LoRA9**:
same as Alex_LoRA8 but with 10 repeats instead of 50.
Results: Trash af, files are small as fuck so prob because of the nd and na.

**Alex_LoRA10**
same as 9 but with nd = 128 and na = 128.
Results: Doesn't look like me.

**Alex_LoRA11**
same as 10 but with 24 epochs instead of 12.
Results:

All sucks, but 1, 2, 5 and 6 are probably the least bad.
1 is the one we used captions with, and it's also the only one that hasn't memorized the input clothes!

### Do fine-tuning with low-rank adaptation article

https://imgur.com/a/mrTteIt

Create a dataset where every image has a corresponding text file describing the image.

It's good to put e.g blue shirt in the corresponding text file if you are wearing a blue shirt on the image, because then the model will know to NOT connect the concept of a blue t-shirt with you (the subject).

The golden rule for training a subject is that anything that you do NOT tag will be part of your subject.

download intermediate checkpoint files wo we can check for overtraining.

What's the difference between LoRA Training (Dreambooth method) and LoRA Training (fine-tune method)?

- Just difference methods apparently. None of them are actually dreambooth.

**With LoRA created from sd1.5:**
bad with rv2
bad with rv2-inpainting
in general very bad except from text-to-image prompts that results in what looks like overtrained images.

### reddit tips

guy uses dreambooth to train himself into the sd1.5 base model, the uses db to train himself into rv2 model and then blend the two models together. source:
https://www.reddit.com/r/StableDiffusion/comments/11m9n6z/after_a_long_time_of_trying_all_forms_of_training/?utm_source=share&utm_medium=android_app&utm_name=androidcss&utm_term=1&utm_content=share_button

civitai down, check later: https://www.reddit.com/r/StableDiffusion/comments/12sasji/guide_to_dreambooth_lora_lycoris/

advanced combination: https://www.reddit.com/r/StableDiffusion/comments/11gnuv8/dreambooth_multicontrolnet_offsetnoise_lora/

LoRA hyperparameters: https://www.reddit.com/r/StableDiffusion/comments/10ir5ax/big_comparison_of_lora_training_settings_8gb_vram/
best results in the 1500 to 3500 step range.

kolla senare: https://www.youtube.com/watch?v=sRdtVanSRl4

### Thoughts

Have not gotten any good results at all. With how they work it would be assume if it worked though.

Experiment to do: train a LoRA on my segmented head.
