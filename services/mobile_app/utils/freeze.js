document.body.addEventListener(
  'click',
  function (event) {
    event.stopPropagation();
    event.preventDefault();
  },
  true
);
