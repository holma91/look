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

### TODO

FRONTEND:

- fix upload by link feature for all chosen websites
- fix error handling for link feature
  - show accepted websites
- one-shot image selection
- design and implement profile/settings page
- sort by price (?)
- fix bugs
  - make it impossible to swipe back a screen when in a webview

BACKEND:

- error handling for inserting SQL

deploy private beta

### TODO rn

- make ui/ux of upload by link feature perfect ; check
- basic image selection for softgoat
- start on profile/settings page ; check
- figure out how to actually do buttons correctly with restyle

## research todos

- try out replicate
- play around with the diffusion models

## todo after beta launch

**small**:

- make lists swipeable
  https://reactnavigation.org/docs/tab-view/
- fix dark mode
- replace all flatlists with flashlists

**big**:

- gpt-4 enhanced scraping
- start designing the "studio" screen
  - skia?
- start designing the "scan your face" stuff
- redo browser screen to looks as much as safari as possible

### what would it take to add dark mode?

- add a theme, switch out the context
  keep in mind that ALWAYS try to do color with restyle components

### TODO far away

- train ML model that can take HTML/Schema.org data and convert it into our schema.
- train ML model that automatically categorizes a liked product, from the text info it has.
- Do the try-it-on stuff
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites
