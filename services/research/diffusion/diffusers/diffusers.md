!pip install --upgrade diffusers accelerate transformers torch torchvision
!nvidia-smi
Restart kernel with cmd + M + . after doing a !pip install

DiffusionPipeline (easiest way to use a pretrained diffusion system for inference)
Contains:

- model
- scheduler

**Stable Diffusion pipeline is composed of:**

- feature_extractor: CLIPImageProcessor
- safety_checker: StableDiffusionSafetyChecker
- scheduler: PNDMScheduler
- text_encoder: CLIPTextModel
- tokenizer: CLIPTokenizer
- unet: UNet2DConditionModel
- vae: AutoEncoderKL

### Schedulers

Schedulers manage going from a noisy sample to a less noisy sample given the model output. They do the "noise subtraction" by doing `scheduler.step`.

**how to get faster generation:**

- run pipelines in float16
- reduce the number of inference steps (choose another scheduler)
- enable attention slicing to reduce memory consumption

**how to get better quality:**

- use better checkpoints
- better prompt engineering

**solve cuda oom:**

- Reduce the `batch_size`
- Lower the Precision
- Do what the error says
- Clear cache
- Modify the Model/Training

```py
import gc
def report_gpu():
   print(torch.cuda.list_gpu_processes())
   gc.collect()
   torch.cuda.empty_cache()
```

### Pipelines

Most general one is DiffusionPipeline. There are also pipelines such as StableDiffusionPipeline, StableDiffusionImg2ImgPipeline, and StableDiffusionInpaintPipeline.

To use the "SD mega pipeline":
`pipe = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", custom_pipeline="stable_diffusion_mega", torch_dtype=torch.float16, revision="fp16")`
SD Mega Pipeline can run txt2img, img2img and inpainting in one pipeline.

Default scheduler (PDPM) is super slow. Change to EulerDiscreteScheduler.

### Conceptual Guides

- diffusers is built to be a natural extension of pytorch.
- prefer copy-pasted code over hasty abstractions

Diffusers essentially consist of three major classes:

- Pipelines
  - every pipeline consits of different model and scheduler components
  - should only be used for inference
- Models
  - natural extensions of pytorch's Module class
- Schedulers
  - are responsible of guiding the denoising process for inference AND for defining the noise schedule for training
