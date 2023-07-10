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
3. go to training screen, see it finish
4. go to likes, sort by website, pick an image, try it on myself, like it, share it,
5. go to the explore page, find something we like, go to website, buy it, change status to bought

TODO:

- create login screen (splash, icon etc)

possible small ui improvements:

- add checkmark when on a website

### ACTUAL DEMO

0. login screen:
   - scroll through
   - login with apple
1. go to model creation
   - scroll through models
   - create model of myself
   - wait for 20 min screen shows up
2. go to shopping
   - favorite some
   - go to favs and unfavorite some
   - go to loro piana
     - choose one thing, don't generate
     - choose the other thing, generate
3. go back training screen, wait until it finishes
4. go to likes
   - show off purchases and history
   - sort by website
   - choose the blue softgoat, generate
   - share
5. go to explore
6. click the newly generated
   - show our shared image
7. click on pink softgoat
   - scroll trough
8. click on lulu
   - scroll through, then back to black
   - generate
   - go to site
   - buy
