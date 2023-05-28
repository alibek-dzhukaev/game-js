/**
 *
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const particlesArray = []
const numberOfParticles = 1000

const titleElement = document.getElementById('title1')
let titleMeasurements = titleElement.getBoundingClientRect()
let title = {
  x: titleMeasurements.left,
  y: titleMeasurements.top,
  width: titleMeasurements.width,
  height: 10
}

class Particle {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.size = Math.random() * 15 + 1
    this.weight = Math.random() + 1
    this.directionX = Math.random() - 1
  }

  update() {
    if (this.y > canvas.height) {
      this.y = 0 - this.size
      this.weight = Math.random() + 1
      this.x = Math.random() * canvas.width * 1.3
    }
    this.weight += 0.01
    this.y += this.weight
    this.x += this.directionX

    // check for collision between each particle and title element
    if (
        this.x < title.x + title.width &&
        this.x + this.size > title.x &&
        this.y < title.y + title.height &&
        this.y + this.size > title.y
    ) {
      this.y -= 3
      this.weight *= -0.5
    }
  }

  draw(ctx) {
    ctx.fillStyle = '#2aa401'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
}

function init() {
  particlesArray.length = 0
  for (let i = 0; i < numberOfParticles; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    particlesArray[particlesArray.length] = new Particle(x, y)
  }
}

init()

function animate() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  particlesArray.forEach(it => {
    it.update()
    it.draw(ctx)
  })

  requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  titleMeasurements = titleElement.getBoundingClientRect()
  title = {
    x: titleMeasurements.left,
    y: titleMeasurements.top,
    width: titleMeasurements.width,
    height: 10
  }
  init()
})
