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

what happens if we search and go to an unsupported site?

- it goes to the all bucket
- gets inserted to the db (or saved locally, and inserted if user favs it?)

- connectors for chosen swedish sites
- "gallery" design, with fav stuff functionality
- choose model UI
- auth
- create model UI
- share functionality

### TODO far away

- write "connectors" for every website. this shouldn't be hard, say 1000 US sites and 100 swedish sites.
- write basic adblocking software.
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites

### fasfs

> at softgoat homepage
> clicks on product (interact script is injected)
