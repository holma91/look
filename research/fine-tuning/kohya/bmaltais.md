## data preparation

https://youtu.be/N4_-fB62Hwk?si=peUQCXLMjWSxvxA2

- choose highest resolution possible, should atleast fit 512x512
- use "bucketing" to take care of any aspect ratio
  https://www.reddit.com/r/DreamBooth/comments/14buyag/can_anyone_explain_buckets/
  "bucket" is a "bucket" (container) as the name suggests. The training images used in LoRA do not have to be of the same size, but images of different sizes cannot be trained at the same time. Therefore, it is necessary to sort the images into "buckets" according to their size before training. Put similar sized images in the same bucket and different sized images in different buckets.

- upscale training images
- crop training images
- use BLIP to caption images

## training

https://youtu.be/k5imq01uvUY?si=sHFpROKTUW2Sabsk

- likes to use constant as LR Scheduler
- train batch size 2
- uses network rank = network alpha = 128 which is max
- enable buckets
  gives us the ability to use various aspect ratios in our images.
