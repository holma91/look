!pip install --upgrade diffusers accelerate transformers torch torchvision
Restart kernel with cmd + M + . after doing a !pip install

DiffusionPipeline (easiest way to use a pretrained diffusion system for inference)

- model
- scheduler

**Stable Diffusion pipeline is composed of:**

- safety_checker: StableDiffusionSafetyChecker
- scheduler: PNDMScheduler
- text_encoder: CLIPTextModel
- tokenizer: CLIPTokenizer
- unet: UNet2DConditionModel
- vae: AutoEncoderKL

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
