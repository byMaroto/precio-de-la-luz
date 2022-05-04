"use strict";

const select = document.getElementById("aparatos");

let value = select.addEventListener("change", function handleChange(event) {
  document.getElementById("deviceImg").src = `img/${event.target.value}.png`;
});
