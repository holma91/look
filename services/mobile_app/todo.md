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

1. handleLoadend injects
2. handleMessage receives

- updates sheet AND sends product to server

### TODO rn

- fix injection and extraction on all given sites

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
