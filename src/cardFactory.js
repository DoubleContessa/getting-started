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
    var self = this
    self.box = document.createElement('a-box')
    self.box.setAttribute('position', self.data.position)
    self.box.setAttribute('color', self.data.color)
    self.box.setAttribute('width', self.data.width)
    self.box.setAttribute('height', self.data.height)
    self.box.setAttribute('depth', self.data.depth)
    self.el.appendChild(self.box)
    self.text = document.createElement('a-text')
    self.text.setAttribute('value', self.data.text)
    self.text.setAttribute('position', {
      x: self.data.position.x,
      y: self.data.position.y - 2,
      z: self.data.position.z + 0.5})
    self.text.setAttribute('width', self.data.text_width)
    self.text.setAttribute('align', 'center')
    self.el.appendChild(self.text)
    self.box.addEventListener('mouseenter', function () {
      self.box.setAttribute('scale', {x: 1.3, y: 1.3, z: 1.3})
      self.text.setAttribute('width', self.data.text_width * 1.5)
      self.text.setAttribute('position', {
        x: self.data.position.x,
        y: self.data.position.y - 2,
        z: self.data.position.z + 0.7})
    })
    self.box.addEventListener('mouseleave', function () {
      self.box.setAttribute('scale', {x: 1, y: 1, z: 1})
      self.text.setAttribute('width', self.data.text_width)
      self.text.setAttribute('position', {
        x: self.data.position.x,
        y: self.data.position.y - 2,
        z: self.data.position.z + 0.5})
    })
  }
})

AFRAME.registerComponent('plot', {
  schema: {
    cards: {type: 'array'}
  },
  update: function () {
    var self = this

    var entity = document.createElement('a-entity')
    entity.setAttribute('axis', {'color': 'green'})
    self.el.appendChild(entity)

    for (let card of this.data.cards) {
      entity = document.createElement('a-entity')
      entity.setAttribute('card', {
        'color': card.color,
        'width': card.width,
        'height': card.height,
        'depth': card.depth,
        'position': {x: card.x, y: card.y, z: card.z},
        'text': card.text
      })
      this.el.appendChild(entity)
    }
  }
})

AFRAME.registerComponent('rounded', {
  schema: {
    enabled: {default: true},
    position: {type: 'vec3', default: {x:0, y:0, z:0}},
    width: {type: 'number', default: 1},
    height: {type: 'number', default: 1},
    depth: {type: 'number', default: 1},
    radius: {type: 'number', default: 0.3},
    topLeftRadius: {type: 'number', default: -1},
    topRightRadius: {type: 'number', default: -1},
    bottomLeftRadius: {type: 'number', default: -1},
    bottomRightRadius: {type: 'number', default: -1},
    color: {type: 'color', default: "#F0F0F0"},
    text: {type: 'string', default: 'holi'},
    text_width: {type: 'number', default: 15},
    opacity: {type: 'number', default: 1}
  },
  init: function () {
    this.rounded = new THREE.Mesh(this.draw(), new THREE.MeshPhongMaterial({ color: new THREE.Color(this.data.color), side: THREE.DoubleSide }))
    this.updateOpacity()
    this.el.setObject3D('mesh', this.rounded)
    this.displayText()
  },
  displayText: function () {
    this.text.setAttribute('align', 'center')
    this.el.appendChild(this.text)
    this.box.addEventListener('mouseenter', function () {
      this.box.setAttribute('scale', {x: 1.3, y: 1.3, z: 1.3})
      this.text.setAttribute('width', this.data.text_width * 1.5)
      this.text.setAttribute('position', {
        x: this.data.position.x,
        y: this.data.position.y - 2,
        z: this.data.position.z + 0.7})
    })
    this.box.addEventListener('mouseleave', function () {
      this.box.setAttribute('scale', {x: 1, y: 1, z: 1})
      this.text.setAttribute('width', this.data.text_width)
      this.text.setAttribute('position', {
        x: this.data.position.x,
        y: this.data.position.y - 2,
        z: this.data.position.z + 0.5})
    })
  },
  update: function () {
    if (this.data.enabled) {
      if (this.rounded) {
        this.rounded.visible = true
        this.rounded.geometry = this.draw()
        this.rounded.material.color = new THREE.Color(this.data.color)
        this.updateOpacity()
      }
    } else {
      this.rounded.visible = false
    }
  },
  updateOpacity: function() {
    if (this.data.opacity < 0) { this.data.opacity = 0 }
    if (this.data.opacity > 1) { this.data.opacity = 1 }
    if (this.data.opacity < 1) {
      this.rounded.material.transparent = true
    } else {
      this.rounded.material.transparent = false
    }
    this.rounded.material.opacity = this.data.opacity
  },
  tick: function () {},
  remove: function () {
    if (!this.rounded) { return }
    this.el.object3D.remove(this.rounded)
    this.rounded = null
  },
  draw: function() {
    var roundedRectShape = new THREE.Shape()
    function roundedRect(ctx, x, y, width, height, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius) {
      if (!topLeftRadius) { topLeftRadius = 0.00001 }
      if (!topRightRadius) { topRightRadius = 0.00001 }
      if (!bottomLeftRadius) { bottomLeftRadius = 0.00001 }
      if (!bottomRightRadius) { bottomRightRadius = 0.00001 }
      ctx.moveTo(x, y + topLeftRadius)
      ctx.lineTo(x, y + height - topLeftRadius)
      ctx.quadraticCurveTo(x, y + height, x + topLeftRadius, y + height)
      ctx.lineTo(x + width - topRightRadius, y + height)
      ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - topRightRadius)
      ctx.lineTo(x + width, y + bottomRightRadius)
      ctx.quadraticCurveTo(x + width, y, x + width - bottomRightRadius, y)
      ctx.lineTo(x + bottomLeftRadius, y)
      ctx.quadraticCurveTo(x, y, x, y + bottomLeftRadius)
    }

    var corners = [this.data.radius, this.data.radius, this.data.radius, this.data.radius]
    if (this.data.topLeftRadius != -1) { corners[0] = this.data.topLeftRadius }
    if (this.data.topRightRadius != -1) { corners[1] = this.data.topRightRadius }
    if (this.data.bottomLeftRadius != -1) { corners[2] = this.data.bottomLeftRadius }
    if (this.data.bottomRightRadius != -1) { corners[3] = this.data.bottomRightRadius }

    roundedRect(roundedRectShape, 0, 0, this.data.width, this.data.height, corners[0], corners[1], corners[2], corners[3])
    return new THREE.ShapeBufferGeometry(roundedRectShape)
  },
  pause: function () {},
  play: function () {}
})

AFRAME.registerPrimitive('a-rounded', {
  defaultComponents: {
    rounded: {}
  },
  mappings: {
    enabled: 'rounded.enabled',
    width: 'rounded.width',
    height: 'rounded.height',
    radius: 'rounded.radius',
    'depth': 'rounded.depth',
    'top-left-radius': 'rounded.topLeftRadius',
    'top-right-radius': 'rounded.topRightRadius',
    'bottom-left-radius': 'rounded.bottomLeftRadius',
    'bottom-right-radius': 'rounded.bottomRightRadius',
    color: 'rounded.color',
    'position': 'rounded.position',
    'text': 'rounded.text',
    opacity: 'rounded.opacity'
  }
})

function createCardsEntityFromItems(items) {
  var entity = document.createElement('a-entity')
  entity.setAttribute('plot', {
    'cards': items
  })
  return entity
}

function createRoundedCardsEntityFromItems(items) {
  var entity = document.createElement('a-entity')

  for (let item of items) {
    var rounded = document.createElement('a-rounded')
    for(let key in item) {
      if(key == 'position') {
        rounded.setAttribute('position', {x: item[key].x, y: item[key].y, z: item[key].z})
      } else {
        rounded.setAttribute(key, item[key])
      }
    }
    entity.appendChild(rounded)
  }
  return entity
}

export default createRoundedCardsEntityFromItems
