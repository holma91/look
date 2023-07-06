what needs to be finished for the demo?

- extraction for all chosen sites
- ui for uploading images, waiting for model to be created, and view created models
- ui for filtering likes/history

1. ui for model creation
   first thing we see:

when clicking create:

- all the text above the flatlist should be removed
- the images in the flatlist should move to the top of the screen

### Code Debt from Demoware

Create.screen.tsx. Not necessarily bad if we disregard when creationMode is true.

### Demo step by step

1. go to model creation
   - scroll through base models
   - generate on myself
2. go to shopping, go to softgoat and try something with a base model, like it
3. go to training screen, see it finish
4. go to likes, sort by brand, pick an image, try it on myself, like it, buy it with apple pay, change status to bought
5. make the generation public, go to the explore page and show what's there

so, the TODO right now is:

- generate some images with auto1111
  - both headshots for ModelPicker and Product tries
- fix sheet stuff for the browser screen
- fix all the fake animations for training a model
-
