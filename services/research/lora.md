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
Results: Looks decents. Not good for inpainting on images far away.

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

**Alex_LoRA5**:
base_model = RV2
same as Alex_LoRA3 but with train_batch_size = 6

**Alex_LoRA6**:
base_model = SD1.5
otherwise, same as Alex_LoRA5.

### Programmatically train LoRAs

LoRA applied to Dreambooth?

Huggingface provides script for fine-tuning. Then we just call that script with bunch of parameters.

### Dreamboothing with LoRA

output from LoRA is a .pt file, that you can merge with a checkpoint to get a .ckpt file?

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

kolla senare (LoRA serie): https://www.youtube.com/@life-is-boring-so-programming

### question

Awesome tutorial!

I just went through it and created "a LoRA" of myself. I used SD1.5 as the base model, and generated a 144mb LoRA file from that with what should resemble me. I can then use this LoRA file with any model I want in the Automatic1111 GUI and generate images. I just have some questions for you:

- How much does it matter what base model I use? Should I always use the base model that I wanna use later? E.g if I want to generate images with Realistic Vision 2.0, should I train the LoRA "on top of" that model?

- I have seen some people train LoRAs, then merge their LoRA with a checkpoint to get a .ckpt file. What's the difference between doing that and doing what you have done here (just putting the LoRA in the right folder and then including it in the prompt)?

- I don't really understand then connection between LoRA and Dreambooth. The file name is kohya-LoRA-dreambooth.ipynb and I often see people write "LoRA with Dreambooth" and similar things, but does this have anything to do with Dreambooth? I thought that was a separate thing, where you actually modify the underlying model and where you always get a new model that's larger as output.

And just as a last question, how do you think this compares with the classical dreambooth approach? In terms of quality, since LoRAs are obviously more space-efficient and takes less time to train.
