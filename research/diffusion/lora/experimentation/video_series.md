## Dataset

Objective: Training LoRA for a fake virtual women.
20 images: 12 close-up, 5 half-body, 3 full-body

### video 1: https://youtu.be/hHQKik0xCDU

Using different training base models.

**models**:
RV1.3
SD1.5
dreamlikephotoreal2.0
avalaontruevisionv2

**hyperparams**
image repeats: 50
batch size: 2
epochs: 10
network dim: 8
network alpha: 1
resolution: 512x512

Conclusion:
txt2img checkpoint should match with training base model.

### video 2: https://youtu.be/yogymGvKVG8

Using different batch sizes.
Testing batch size 2, 4, 8, and 16.

Observation:
When batch size increase, txt2img results in higher weights becoming less saturated, but it takes more training epochs to learn the target.

Conclusion:
Choose as high as your graphic card VRAM allows.

### video 3: https://youtu.be/57Fk7BX5Q8A

Using different network dimensions and alpha.

Observation:
When network dimension and network alpha increase, txt2img results look better, more realistic and brigher. However, the output LoRA file size is larger.

Conclusion:
Choose nd = 128 and na = 128 if you do not need to merge with other LoRA models.
If you need to merge, choose the same nd and na as the LoRA models you want to merge with.
