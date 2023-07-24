## Theory

ControlNets are "external networks" that we tack onto the main SD model.

A single fwd pass consists of:

- taking an input image and passing it to both the external network and the SD model
- taking a prompt and passing it to both the external network and the SD model
- taking the extra conditioning and passing it only to the external network

The information flows through both models at the same time, and about halfways through, the external network will start to shovel information into the main SD model.

ControlNet models are not that expensive to train.

### T2I adapter

"A more elegant and clean implementation from an engineering view" according to people.

T2I-Adapter supports more than one model for one time input guidance, for example, it can use both sketch and segmentation map as input condition or guided by sketch input in a masked area (inpaint) at the same time. This gives even more control than either mode alone.

## with ComfyUI
