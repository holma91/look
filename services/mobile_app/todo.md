### thoughts

What do with brand?

1. strip whitespace
2. make lowercase
3. replace " " with "-"

### image extraction feature

so the plan is to first make a guess, and try to extract images.

1. try getting from schema.org
2. all images that's not nested in a link and in a certain size
3. always allow the user to to click by themselves

### TODO rn

- hide all test model stuff
- build and deploy

**replace all flatlists with flashlists**:

## research todos

- try out replicate
- play around with the diffusion models

## client todos

**small**:

- fix everything with the browser sheet ui
  - automatically select images
  - make images selectable
- ui fixes in navbar
- make lists swipeable
  https://reactnavigation.org/docs/tab-view/
- fix dark mode
- make it impossible to swipe back a screen when in a webview
- replace all flatlists with flashlists

**big**:

- fix upload link feature
  - this is where we look into gpt-4 for extraction
- start designing the "studio" screen
  - skia?
- start designing the "scan your face" stuff

**what would it take to add dark mode?**

- add a theme, switch out the context
  keep in mind that ALWAYS try to do color with restyle components

### TODO far away

- train ML model that can take HTML/Schema.org data and convert it into our schema.
- train ML model that automatically categorizes a liked product, from the text info it has.
- Do the try-it-on stuff
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites
