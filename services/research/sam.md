- generate masks automatically
- create segmentation masks using bounding boxes
- convert object detection datasets into segmentation masks

three different encodes you can use (from less to more params, fast to slow, lower quality to higher quality):
ViT-B, ViT-L, and ViT-H.

### Generating masks

So, you can generate masks of basically everything in an image. Every mask/segmentation have the following fields:
segmentation - [np.ndarray]:
the mask with (W, H) shape, and bool type, where W and H are the width and height of the original image, respectively

area - [int]:
the area of the mask in pixels

bbox - [List[int]]:
the boundary box detection in xywh format

predicted_iou - [float]:
the model's own prediction for the quality of the mask

point_coords - [List[List[float]]]:
the sampled input point that generated this mask

stability_score - [float]:
an additional measure of mask quality

crop_box - List[int]:
the crop of the image used to generate this mask in xywh format

### Generating segmentation with bounding box

- from a bounding box, generate the mask

## Notes

- can basically segment all skin -> possible to replace model with different skin colour
- can be prompted with text, bounding box, pointer and mask
