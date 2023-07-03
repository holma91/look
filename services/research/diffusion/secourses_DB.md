video: https://youtu.be/g0wXIcRhkJk
text: https://github.com/FurkanGozukara/Stable-Diffusion/blob/main/Tutorials/No-More-Studio-Photoshoot-Realistic-DreamBooth-Training.md

### Classification images

Pre-prepared real images from unsplash (2700 in very high quality). Different aspect ratios (512x512 to 1024x768 and everything in between). Before DB training, downscale the images to target dimension with "Auto focal point crop". Since we use REAL images for classification, we are in a sense fine-tuning the base model also (on top of teaching it how our face looks).

**auto-cropping script**:
takes raw images, and crops the subject (person) based on predefined aspect ratios. Used for preparing training images.

## Dreambooth training

### Create

model: RV2.0_FP32
512x model, unfreeze model (empirically improves performance according to secourses).
When clicking create model, a checkpoint of the base model gets extracted to models/dreambooth. We can here see the vae, unet, tokenizer, text_encoder and scheduler (the different parts in a diffusers pipeline).
We have now "created", lets move on.

### Select

What matters for best realism is the
used base model:
used resolution:
used images quality:

Training Steps Per Image (Epochs): 200
Save Model Frequency (Epochs): 10
Save Preview(s) Frequency: 0 (may cause errors apparently, instead use xyz plot to find the best ckpt)

Secourses says that smaller batch size => better generalism, better fine details

Batch Size: 1
Gradient Accumulation Steps: 1
Class Batch Size (doesn't matter because we shouldn't use db extension to generate classification images): 4

The following assume we have >24gb GPU RAM. Otherwise use smaller LR and and optimizer (8bit AdamW).

Learning Rate: 1e-7 = 0.0000001
Text Encoder Learning Rate: 1e-7
Learning Rate Scheduler: constant_with_warmup
Learning Rate Warmup Steps: 0

**Image Processing**
Very important!
Higher max resolution => better results, BUT max resolution also depends on your base model. "RV2 has a very good resolution, but probably the max we can go is 1024".
Max Resolution: 1024
Apply Horizontal Flip and Dynamic Image Normalization: False (empirically decreased quality)

Use EMA with optimizer Lion (best empirically).
Mixed Precision: bf16
Memory Attention: default (xformers decrease quality)

Cache Latents: True
Train UNET: True
Step Ratio of Text Encoder Training: 0.75
Offset noise (used to have more contrast of the output images): 0

Freeze Clip Normalization Layers: False
Clip Skip: 1
Weight Decay: 0.1 (use 0.01 if you have less VRAM)
TENC Weight Decay: 0.1
TENC Gradient Clip Norm: 0

We set a lower learning rate and higher weight decay. Why? Because we are using Lion optimizer. This LR and weight decay is set for Lion.

Pad Tokens: True
Strict Tokens: False
Shuffle Tags: True
Max Token Length: 75

Scale Prior Loss: False
Prior Loss Weight: 0.75

### Concept Tab

"I'm not using captions for training a person, it is not improving the realism".
The most important part of DreamBooth training for realism is the training images dataset. More diverse background and clothing is better.

"For most realism we need the highest resolution with 768 by 1024".
Okay so:

1. put the raw images through cropper.py
2. go to the train tab in auto1111 and "preprocess images"
3. choose the path to the raw images, select Auto focal point crop and face weight = 1

We now have our training images in 768x1024.

"Classification images will prevent the model from overtraining, and it's used to keep the models previous knowledge" We use REAL images for the classification dataset.

**filewords**:
"I don't use instance token or class token"
**Training prompts**:
Instance prompt: ohwx man (ohwx is our "rare token" and man is our "class token")
Class prompt: man (because all classification images are men)

If we would use captions for our images, we would need to add the "filewords" to the instance prompt. When we prepare our images, we can use BLIP or deepbooru.

"I find that captioning is necessary for fine-tuning, but not for teaching a style or a subject".

**Class Image Generation**
Class Images Per Instance Image: 100 (I have 14 training images => need atleast 14x100=1400 classification images)
Classification CFG Scale: 7.5
Classification Steps: 40

**Sample Image Generation**
Don't care about this since we use xyz plot to compare the checkpoints.

### Saving tab

Save EMA weights to generated models: False (this is not improving quality)
Generate a .ckpt (.safetensors) file when saving during training: True

/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/data/training/768x1024_ratio_raw
/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/data/training/768x1024_ratio

dataset directory:
/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/data/training/768x1024_ratio

classification dataset directory:
/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/data/classification/768x1024_2724_imgs
