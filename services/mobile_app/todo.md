app: images -> server

user clicks create LoRA: start animations that's similar to when ordering food

Pages:

- Create LoRA
- Browse sites (coinbase inspo)
- Shop on site (klarna inspo)

what's left for making this a minimally usable product (for me)?

- connectors for all chosen sites

### How to find the product images on a given page

look for image elements that are not wrapped in "a tags". Works on:

- hm.com
- softgoat.com
- zara.com
- adaysmarch.com (uses picture element)
- careofcarl.com
- sellpy.com
  maybe this is universal!

### TODO rn

- make search bar work

### TODO

- Do the try-it-on stuff

So, one image will be selected. Send that to the image-gen server.

DEFAULT MODELS:

- white man
- black man
- white woman
- asian woman

activating extra network lora with arguments [<modules.extra_networks.ExtraNetworkParams object at 0x7fd614987820>]: AttributeError
Traceback (most recent call last):
File "/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/modules/extra_networks.py", line 75, in activate
extra_network.activate(p, extra_network_args)
File "/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/extensions-builtin/Lora/extra_networks_lora.py", line 23, in activate
lora.load_loras(names, multipliers)
File "/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/extensions-builtin/Lora/lora.py", line 170, in load_loras
lora = load_lora(name, lora_on_disk.filename)
File "/content/drive/MyDrive/stable-diffusion-webui-colab/stable-diffusion-webui/extensions/a1111-sd-webui-locon/scripts/main.py", line 371, in load_lora
lora.mtime = os.path.getmtime(lora_on_disk.filename)
AttributeError: 'str' object has no attribute 'filename'

### TODO far away

- train ML model that can take HTML/Schema.org data and convert it into our schema.
- train ML model that automatically categorizes a liked product, from the text info it has.
- Do the try-it-on stuff
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites

### fasfs

> at softgoat homepage
> clicks on product (interact script is injected)
