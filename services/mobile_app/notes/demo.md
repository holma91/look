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

### models for demo

- me (seed 3000 is good)
- [woman: Ana de Armas: 0.5]
- [black man: Jamie Foxx: 0.5]
- [man: Leonardo DiCaprio: 0.75], 2786372404

### Demo step by step

0. login with apple faceid
1. go to model creation
   - scroll through base models
   - generate on myself
2. go to shopping, go to loro piana and try something with a base model, like it
   - TODO: choose product, generate with auto1111
3. go to training screen, see it finish
4. go to likes, sort by brand, pick an image, try it on myself, like it, share it,
   - TODO: sort by brand
5. go to the explore page, find something we like, go to website, buy it, change status to bought
   - TODO choose image here, generate both with base model and me

other TODOs are:

- create login screen (splash, icon etc)
