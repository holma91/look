### inject

### SELECT MODE

by clicking a button, we disable ALL onclick events on a page.
then make all images selectable.

```js
document.body.addEventListener(
  'click',
  function (event) {
    console.log('click');
    event.stopPropagation();
    event.preventDefault();
  },
  true
);
```
