### thoughts

What do with brand?

1. strip whitespace
2. make lowercase
3. replace " " with "-"

**image extraction**:
so the plan is to first make a guess, and try to extract images.

1. try getting from schema.org
2. all images that's not nested in a link and in a certain size
3. always allow the user to to click by themselves

injection & extraction process:

1. handleLoadend
2. handleMessage

- receives product data
- parses it with parseProduct
- updates sheet AND sends structured product to server

As long as handleLoadEnd is called for every new product, this is fine.

the questions is, should the baseExtractScript include include an interval, and get called every x ms?

Yes, this was a very good idea. Next up, create a caching layer in the webview, that checks diffs between page loads. Like, if it's a new url, the images can't be the same.

at time x:
url = a, image = b

at time y:
if url is different, then image HAVE to be different.

so, we store that last url and last image in the browser storage.

fix cache!

### TODO rn

- fix everything with the browser sheet ui
  - automatically select images
  - make images selectable
- fix upload link feature
- ui fixes in navbar
- history functionality on Shop screen
  - take UI from coinbase
- make lists swipeable
  https://reactnavigation.org/docs/tab-view/

also:

- chill with the deployment for a few days to see if any accelerator is interested

### TODO

- Clean up demoware
- Separate app into V1 and Demo (toggleable between)
- do last things for V1, launch
- deep dive into useReducer
- finish tabular data video

### TODO far away

- train ML model that can take HTML/Schema.org data and convert it into our schema.
- train ML model that automatically categorizes a liked product, from the text info it has.
- Do the try-it-on stuff
- make it so that when a user favorites something, it's checked daily if the size exists etc.
- put in shopping info somewhere in app, and autofill on sites
