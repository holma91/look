The torchvision package consists of popular datasets, model architectures, and common image transformations for computer vision.

The torchvision.models subpackage contains definitions of models for addressing different tasks, including: image classification, pixelwise semantic segmentation, object detection, instance segmentation, person keypoint detection, video classification, and optical flow.

Before using the pre-trained models, one must preprocess the image by doing things like:

- resize with right resolution/interpolation
- apply inference transforms
- rescale the values

### Object detection

### nb: Transforms v2: End-to-end object detection example
