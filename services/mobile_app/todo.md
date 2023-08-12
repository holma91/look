## IMPORTANT TASKS

- PERFECT EXTRACTION FROM CHOSEN SITES!
- IMAGE GENERATION!

## LESS IMPORTANT TASKS

- FINISH DARK MODE

### TOMORROW

GO SUPER DEEP IN THE WHOLE EXTRACTION PROCESS. STEP BY STEP, WE SHOULD FIND EVERY WEIRD THING. THE WHOLE DAMN BRIDGE IS UNRELIABLE.

- REWRITE handleMessage

  - not up to standard

- REWRITE the lock

DO NOT STOP UNTIL EVERY BUG IS GONE.

### TODO

REFACTOR:

- sync types on both ends
- fix api
- add error messages and stuff on the BE

FRONTEND:

- fix parsing for all sites we got that have schema.org integrated.
- make a big letter for sites without logos
- make it possible to remove from lists
  - individually
  - in bulk
- make it possible to remove lists
- fix bugs
  - make it impossible to swipe back a screen when in a webview

BACKEND:

- error handling for inserting SQL
- do schema changes to allow for arbitrary company and product lists

deploy private beta

### TODO rn

- make it possible to delete from lists ; check
- make it possible to bulk delete from lists ; check
  - action sheet stuff ; check
- make it possible to add to lists
  - make it possible to add single product to list
  - do add sheet design and implement
- https://gorhom.github.io/react-native-bottom-sheet/react-navigation-integration for nav in sheet
- get codebase in great shape -> then do more sd stuff

what's needed to get the codebase into good shape?

- switch current hold-menu to zeego
- make all mutations perfect
- do necessary db changes
- add more error handling to the API

## research todos

- try out replicate
- play around with the diffusion models

## todo after beta launch

**small**:

- make lists swipeable
  https://reactnavigation.org/docs/tab-view/
- fix dark mode
- replace all flatlists with flashlists
- sort by price

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

### hold menu

buggy at times

- when going in to select mode and then back, only select mode works.

I think the like bug is fixed by using action params?
