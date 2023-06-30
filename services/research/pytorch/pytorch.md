# PyTorch

Quickstart: https://pytorch.org/tutorials/beginner/basics/quickstart_tutorial.html

PyTorch has two primitives to work with data: torch.utils.data.DataLoader and torch.utils.data.Dataset. Dataset stores the samples and their corresponding labels, and DataLoader wraps an iterable around the Dataset.

PyTorch offers domain-specific libraries such as TorchText, TorchVision, and TorchAudio, all of which include datasets. E.g the torchvision.datasets module contains Dataset objects for many real-world vision data like CIFAR and COCO.

**Basic Model**:

```py
class NeuralNetwork(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10)
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

model = NeuralNetwork()
```

Logits: the vector of RAW predictions that a classification model generates. If it's a multi-class classification problem, logits typically become input to a softmax function. Basically, it's the output from a model before any "normalization".

To train a model, we also need a loss function (nn.CrossEntropyLoss) and an optimizer (torch.optim.SGD).

**Training**:

```py
loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=1e-3)

def train(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    model.train()
    for batch, (X, y) in enumerate(dataloader):
        X, y = X.to(device), y.to(device)

        # Compute prediction error
        pred = model(X) # nn.Module probably implements __call__
        loss = loss_fn(pred, y)

        # Backpropagation
        loss.backward()
        optimizer.step()
        optimizer.zero_grad()

        if batch % 100 == 0:
            loss, current = loss.item(), (batch + 1) * len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")
```

### PyTorch in colab

https://pytorch.org/tutorials/beginner/colab
`!pip3 install torch torchaudio torchvision torchtext torchdata`
`!pip3 uninstall --yes torch torchaudio torchvision torchtext torchdata`

### Models

Faster R-CNN: A model that predicts both bounding boxes and class scores for potential objects in an image.
Mask R-CNN: Adds an extra branch to Faster R-CNN, and thereby also predicts segmentation masks for each instance.

DeepLabV3: For iamge segmentation, can run natively on iOS and Android.

ResNetX: A Residual Network that's a type of a CNN. An X-layer CNN. Often used as a backbone for many computer vision tasks, such as classification, object detection and semantic segmentation.

### Datasets

CIFAR, COCO,
