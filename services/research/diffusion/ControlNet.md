### Overview

It's multiple models, all are fine-tuned on SD.

Adds another input to the model, so now we can do noise+prompt+(another_input) where another_input can for example be a depth map. It's a powerful way to condition the UNet?

The weights of the SD models are freezed. In additition to that we create an external network (the trainable copy). The external network takes in e.g the depth map. The external network somehow injects it's information to the SD model without changing it weights (this idea is closely linked to hypernetworks).

### Possible applications

### SD WebUI
