### what does it take build v0.1?

- UI
- Integrate and maybe change some on the backend to "save products"
- FastSAM in browser

- run some model in the browser that predicts if it's a person
  - onnx
  - tensorflow.js

if the current viewed image is a person, show the segmentation, and enable the generate button.

### generating

1. Click try

### TODO

- run torchserve with better model

https://twitter.com/yacineMTB/status/1680949563325071361

the model will have to take a bunch of special settings as input. only thing I've seen that accepts all those options is auto1111. because of that, we probably have to reverse engineer it.

if I have auto1111 api running at a endpoint, we can just use it from our frontend. Boom!

### SD api
