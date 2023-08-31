## Overview

Instead of using something like Flask or FastAPI, we can use torchserve which is optimized for ML workflows.

## Technical details

TorchServe takes a Pytorch deep learning model and it wraps it in a set of REST APIs. It comes with a built-in web server that you run from the command line. You can call it like this:
`torchserve --start --ncs --model-store model_store --models <model_name>`

### IMPORTANT

When installing, add captum and PyYAML to dependencies. Maybe also torch and torchvision.
