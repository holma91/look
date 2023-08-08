### Grounding DINO

A SOTA zero-shot object detection model. Seems to be very good.
prompt -> bounding box.

**use-cases**:

- automated data annotation

### Grounding SAM

Combines Grounding DINO with SAM.
Get good results by just prompting with "clothes". If we get the clothes mask here, we can just inpaint around it.

### OSX

https://osx-ubody.github.io/
For creating 3D whole-body mesh from a SINGLE image.
