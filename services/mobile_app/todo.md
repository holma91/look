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

THURSDAY:

- do explore page
- fix so that all chosen sites can be used
- add filtering functionality on brand, website, price

NEXT WEEK (focus on demo for AIGrant):

- Dreambooth
- filter/search UI on likes
- "completion" productData to product
- UI details before demo!
  - font
  - spacing
  - border radiuses

### TODO

- Do the try-it-on stuff

So, one image will be selected. Send that to the image-gen server.

DEFAULT MODELS:

- white man
- black man
- white woman
- asian woman

### TODO far away

- train ML model that can take HTML/Schema.org data and convert it into our schema.
- train ML model that automatically categorizes a liked product, from the text info it has.
- Do the try-it-on stuff
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites

### now

what happens when I visit a product page:

1. handleLoadEnd gets called with the navState (most importantly, the url)
2. we inject the baseExtractScript, which sends back the @type === 'Product' part of the HTML
3. we receive the @type === 'Product' part of the HTML in WebViewBox.handleMessage
4. we call parseProduct(url, domain, productData) and get back a structured product
5. we send the structured product to the backend
