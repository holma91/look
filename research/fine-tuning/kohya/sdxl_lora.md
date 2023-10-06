### Tips

- if possible, turn off xformers.
- if training a subject, using the minimum batch size (1) is better.
- "repeats" parameter: "x times training of each image in one epoch, each time with a different class image"
- epochs here are related to the "repeats" parameter. if we set repeats to 20, then 1 epoch will in a sense in practice be 20 epochs.
- cache latents to improve training speed
- for SDXL, use AdaFactor optimizer. Uses small amount of VRAM compared to other optimizors.
- higher network rank results in higher VRAM usage and larger checkpoints. We use network rank 256 and network alpha 1. Increasing network alpha will results in overtraining quickly.
  size stuff:

https://www.reddit.com/r/StableDiffusion/comments/11iwo3q/lora_train_image_size_and/

### To speed up training

run the following on A5000 GPU:
`apt install libcudnn8=8.9.5.29-1+cuda11.8 libcudnn8-dev=8.9.5.29-1+cuda11.8`

### Print training command

```
08:21:24-893511 INFO     Start training LoRA Standard ...
08:21:24-896432 INFO     Checking for duplicate image filenames in training data directory...
08:21:24-903524 INFO     Valid image folder names found in: /workspace/stable-diffusion-webui/models/Lora/img
08:21:24-905986 INFO     Valid image folder names found in: /workspace/stable-diffusion-webui/models/Lora/reg
08:21:24-908370 INFO     Headless mode, skipping verification if model already exist... if model already exist it will be overwritten...
08:21:24-911423 INFO     Folder 20_ohwx man: 10 images found
08:21:24-912557 INFO     Folder 20_ohwx man: 200 steps
08:21:24-913558 WARNING  Regularisation images are used... Will double the number of steps required...
08:21:24-914706 INFO     Total steps: 200
08:21:24-915965 INFO     Train batch size: 1
08:21:24-916911 INFO     Gradient accumulation steps: 1
08:21:24-917876 INFO     Epoch: 10
08:21:24-918782 INFO     Regulatization factor: 2
08:21:24-919718 INFO     max_train_steps (200 / 1 / 1 * 10 * 2) = 4000
08:21:24-921193 INFO     stop_text_encoder_training = 0
08:21:24-922297 INFO     lr_warmup_steps = 0
08:21:24-923882 WARNING  Here is the trainer command as a reference. It will not be executed:
```

```
accelerate launch
--num_cpu_threads_per_process=2 "./sdxl_train_network.py"
--enable_bucket
--min_bucket_reso=256
--max_bucket_reso=2048
--pretrained_model_name_or_path="/workspace/stable-diffusion-webui/models/Stable-diffusion/sd_xl_base_1.0.safetensors"
--train_data_dir="/workspace/stable-diffusion-webui/models/Lora/img"
--reg_data_dir="/workspace/stable-diffusion-webui/models/Lora/reg"
--resolution="1024,1024"
--output_dir="/workspace/stable-diffusion-webui/models/Lora/model"
--logging_dir="/workspace/stable-diffusion-webui/models/Lora/log"
--network_alpha="1"
--save_model_as=safetensors
--network_module=networks.lora
--text_encoder_lr=0.0004
--unet_lr=0.0004
--network_dim=256
--output_name="chris_moltesanti_v1.0"
--lr_scheduler_num_cycles="10"
--no_half_vae
--learning_rate="0.0004"
--lr_scheduler="constant"
--train_batch_size="1"
--max_train_steps="4000"
--save_every_n_epochs="1"
--mixed_precision="bf16" --save_precision="bf16"
--cache_latents --cache_latents_to_disk
--optimizer_type="Adafactor"
--optimizer_args scale_parameter=False relative_step=False warmup_init=False
--max_data_loader_n_workers="0"
--bucket_reso_steps=64
--gradient_checkpointing
--xformers
--bucket_no_upscale
--noise_offset=0.0
```

### Buckets

got the following buckets:

```
make buckets
min_bucket_reso and max_bucket_reso are ignored if bucket_no_upscale is set, because bucket reso is defined by image size automatically / bucket_no_upscaleが指定された場合は、bucketの解像度は画像サイズから自動計算されるため、min_bucket_resoとmax_bucket_resoは無視されます
number of images (including repeats) / 各bucketの画像枚数（繰り返し回数を含む）
bucket 0: resolution (768, 1216), count: 20
bucket 1: resolution (832, 1152), count: 20
bucket 2: resolution (896, 1152), count: 20
bucket 3: resolution (960, 960), count: 20
bucket 4: resolution (1024, 896), count: 20
bucket 5: resolution (1024, 960), count: 20
bucket 6: resolution (1024, 1024), count: 200
bucket 7: resolution (1088, 960), count: 20
bucket 8: resolution (1152, 832), count: 20
bucket 9: resolution (1216, 768), count: 20
bucket 10: resolution (1216, 832), count: 20
```
