### Network Volume

A volume that can be shared between pods?

### Commands

To kill the webui:
`fuser -k 3000/tcp`

To start it from the CLI:
`python relauncher.py`

### ComfyUI

Use same venv as sd-webui. Run `python main.py --listen 0.0.0.0 --port 3005` to start ComfyUI.
More info and workflows: https://github.com/FurkanGozukara/Stable-Diffusion/blob/main/Tutorials/How-To-Use-ComfyUI-On-Your-PC-On-RunPod-On-Colab-With-SDXL.md
