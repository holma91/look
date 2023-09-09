## Overview

Instead of using something like Flask or FastAPI, we can use torchserve which is optimized for ML workflows.

## Technical details

TorchServe takes a Pytorch deep learning model and it wraps it in a set of REST APIs. It comes with a built-in web server that you run from the command line.

**archive command**:
`torch-model-archiver --model-name densenet161 --version 1.0 --model-file ./serve/examples/image_classifier/densenet_161/model.py --serialized-file densenet161-8d451a50.pth --export-path model_store --extra-files ./serve/examples/image_classifier/index_to_name.json --handler image_classifier`
`torch-model-archiver --model-name deeplabv3_resnet_101 --version 1.0 --model-file ./serve/examples/image_segmenter/deeplabv3/model.py --serialized-file deeplabv3_resnet101_coco-586e9e4e.pth --handler image_segmenter --extra-files ./serve/examples/image_segmenter/deeplabv3/deeplabv3.py,./serve/examples/image_segmenter/deeplabv3/intermediate_layer_getter.py,./serve/examples/image_segmenter/deeplabv3/fcn.py`
`torch-model-archiver --model-name segment_anything --version 1.0 --serialized-file sam_vit_h_4b8939.pth --handler segment-anything/handler.py`
We are packaging the model into a .mar file that can be served by torchserve.
What we need is:

- a model file (e.g: ./serve/examples/image_classifier/densenet_161/model.py)
- a serialized file containing the weights (e.g: densenet161-8d451a50.pth)
- extra files
  Specifies additional files that should be included in the .mar package. These could be files like class-index mapping in JSON format, configuration files, etc.
- a handler
  Specifies the handler to be used for pre-processing, inference, and post-processing. This could be either a built-in handler provided by TorchServe
  (like image_classifier for image classification tasks) or a custom handler you've written.

**start command**:
`torchserve --start --ncs --model-store model_store --models <model_name>`
`torchserve --start --model-store . --models segment_anything.mar`
`torchserve --start --model-store . --models segment_anything.mar --ts-config ./segment-anything/config.properties`

**predictions**:
`curl -X POST "http://127.0.0.1:8080/predictions/segment_anything/1.0" -T "kitten_small.jpg"``

### TODO

- go through the predictor_example.ipynb with the codebase side by side.
- check out torchserve more
- try to map the two together
