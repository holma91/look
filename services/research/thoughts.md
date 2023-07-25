resources:

- https://www.reddit.com/r/StableDiffusion/comments/155k1ck/a_real_skirt_in_the_ai_fashion_model/
- https://www.reddit.com/r/StableDiffusion/comments/156j80k/trying_to_generate_a_person_that_can_fit_this/
-

### Get reddit clothing stuff to work

So, it seems like we have some different approaches.

**inpaint around the clothing**:
reference-only?
canny?
openpose?

what we need to do:

- need to get mask of the clothing from Model image

**controlnet**:

what we need to do:

- have a raw product image

Maybe a generation should give the user some examples of both?

reference only controlnet of the clothing
openpose of a pose
canny? depth? soft edge? lineart?
