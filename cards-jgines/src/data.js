// Simple JS file for figures.html

// We need the A-frame library
import aframe from 'aframe';

var items = [
    {x: -5, y: 4, z: 1, width: 6, height: 9, depth: 1, color: "#ff0000", text: "Contessa"},
    {x: 5  , y: 4, z: 1, width: 6, height: 9, depth: 1, color: "#ff0000", text: "Contessa"}
];


AFRAME.registerComponent('card', {
    schema: {
      position: {type: 'vec3', default: {x:0, y:0, z:0}},
      width: {type: 'number', default: 1},
      height: {type: 'number', default: 1},
      depth: {type: 'number', default: 1},
      color: {type: 'string', default: 'red'},
      text: {type: 'string', default: ''},
      text_width: {type: 'number', default: 15}
    },

    update: function () {
      var self = this;
      self.box = document.createElement('a-box');
      self.box.setAttribute('position', self.data.position);
      self.box.setAttribute('color', self.data.color);
      self.box.setAttribute('width', self.data.width);
      self.box.setAttribute('height', self.data.height);
      self.box.setAttribute('depth', self.data.depth);
      this.el.appendChild(self.box);
      self.text = document.createElement('a-text');
      self.text.setAttribute('value', self.data.text);
      self.text.setAttribute('position', {
        x: self.data.position.x,
        y: self.data.position.y - 2,
        z: self.data.position.z + 0.5});
      self.text.setAttribute('width', self.data.text_width);
      self.text.setAttribute('align', 'center');
      this.el.appendChild(self.text);
      self.box.addEventListener('mouseenter', function () {
        self.box.setAttribute('scale', {x: 1.3, y: 1.3, z: 1.3});
      });
      self.box.addEventListener('mouseleave', function () {
        self.box.setAttribute('scale', {x: 1, y: 1, z: 1});
      });
    }
});

AFRAME.registerComponent('plot', {
    schema: {
      position: {type: 'vec3', default: {x:0, y:0, z:0}},
      color: {type: 'string', default: 'red'},
      size: {type: 'number', default: 1},
      cards: {type: 'array'}
    },

    update: function () {
      var self = this;

      var entity = document.createElement('a-entity');
      entity.setAttribute('axis', {'color': 'green'});
      this.el.appendChild(entity);

      for (let card of this.data.cards) {
        entity = document.createElement('a-entity');
        entity.setAttribute('card', {
          'color': card['color'],
          'width': card['width'],
          'height': card['height'],
          'depth': card['depth'],
          'position': {x: card['x'], y: card['y'], z: card['z']},
          'text': card['text']
        });
        this.el.appendChild(entity);
      };
    }
});

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");

    var scene = document.querySelector('a-scene');
    var entity = document.createElement('a-entity');
    entity.setAttribute('plot', {
      'color': 'blue',
      'size': 1,
      'position': {x: 0, y: 0, z: 0},
      'cards': items
    });
    scene.appendChild(entity);
});
