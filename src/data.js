import aframe from 'aframe';

import createCardsEntityFromItems from './cardFactory';

var items = [
  {x: -5, y: 4, z: 1, width: 6, height: 9, depth: 1, color: "#ff0000", text: "Contessa"},
  {x: 5  , y: 4, z: 1, width: 6, height: 9, depth: 1, color: "#ff0000", text: "Contessa"}
];

document.addEventListener("DOMContentLoaded", function(event) {
  console.log("DOM fully loaded and parsed");

  var scene = document.querySelector('a-scene');
  var entity = createCardsEntityFromItems(items)  
  scene.appendChild(entity);
});
