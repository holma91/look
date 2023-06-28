1. User picks 1 image and 1 name
2. User clicks generate

3. Server receives 1 image and 1 name.
   4.1 Model takes the image, segments everything except the clothes
   4.2 Set up the prompt (depends on the name from the user)

The server now has the image, the segmentation mask, and the prompt.

5. send image, mask and prompt to replicate (service that runs diffusion models)
6. receive new images from replicate
7. send images to back to the user

### Segmentation

As a baseline, we now that this is possible with SAM.

Clothes = Human - Skin.
https://github.com/yumingj/DeepFashion-MultiModal
https://github.com/levindabhi/cloth-segmentation
https://cs230.stanford.edu/projects_fall_2021/reports/103136976.pdf
CLIPSeg?
