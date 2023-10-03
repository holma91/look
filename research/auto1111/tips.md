## Tips & Tricks from Oliver Sarikas

Negative embedding are good.

### add_detail LoRA

Pretty good result if we check with xyz plot.

### Img2img Change Ethnicity Trick

Decent, but hair will be too similar.

### Inpainting

low denoise strength for changing stuff like face expression. high for changing the person.

### ADetailer

LoRA with low value in main prompt so that the model attempts to generate the person. Then LoRA with high value in the ADetailer prompt so that the model fixes it close up.
