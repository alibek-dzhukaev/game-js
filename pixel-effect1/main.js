const myImage = new Image()
myImage.src = 'girl.jpeg'

myImage.addEventListener('load', () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d')
  canvas.width = 600
  canvas.height = 600
  const gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height)
  gradient1.addColorStop(0.2, 'pink')
  gradient1.addColorStop(0.3, 'red')
  gradient1.addColorStop(0.4, 'orange')
  gradient1.addColorStop(0.5, 'yellow')
  gradient1.addColorStop(0.6, 'green')
  gradient1.addColorStop(0.7, '#f933ff')
  gradient1.addColorStop(0.8, 'violet')

  const letters = ['A', 'L', 'I', 'B', 'E', 'K']
  let switcher = 1
  let counter = 0
  setInterval(() => {
    counter++
    if (counter % 12 === 0) {
      switcher *= -1
    }
  }, 500)

  ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height)
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  let particlesArray = []
  const numberOfParticles = 1000

  let mappedImage = []
  for (let y = 0; y < canvas.height; y++) {
    const row = []
    for (let x = 0; x < canvas.width; x++) {
      const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
      const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
      const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
      const brightness = calculateRelativeBrightness(red, green, blue)
      const cell = [
        brightness,
        `rgb(${red}, ${green}, ${blue})`
      ]
      row.push(cell)
    }
    mappedImage[mappedImage.length] = row
  }

  function calculateRelativeBrightness(red, green, blue) {
    return Math.sqrt(
        (red * red) * 0.299 +
        (green * green) * 0.587 +
        (blue * blue) * 0.114
    ) / 100
  }


  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width
      this.y = 0
      this.speed = 0
      this.velocity = Math.random() * 0.5
      this.size = Math.random() * 1.5 + 1
      this.position1 = Math.floor(this.y)
      this.position2 = Math.floor(this.x)
      this.angle = 0
      this.letter = letters[Math.floor(Math.random() * letters.length)]
      this.random = Math.random()
    }

    update() {
      this.position1 = Math.floor(this.y)
      this.position2 = Math.floor(this.x)
      if (mappedImage[this.position1] && mappedImage[this.position1][this.position2]) {
        this.speed = mappedImage[this.position1][this.position2][0]
      }
      let movement = (2.5 - this.speed) + this.velocity
      this.angle += this.speed / 20
      this.size = this.speed * 1.5

      // if (switcher === 1) {
      //   ctx.globalCompositeOperation = 'luminosity'
      // } else {
      //   ctx.globalCompositeOperation = 'lighter'
      // }
      // if (counter % 10 === 0) {
      //   this.x = Math.random() * canvas.width
      //   this.x = 0
      // }

      this.y += movement + Math.cos(this.angle) * 2
      this.x += movement + Math.sin(this.angle) * 2
      if (this.y >= canvas.height) {
        this.y = 0
        this.x = Math.random() * canvas.width
      }
      if (this.x >= canvas.width) {
        this.x = 0
        this.y = Math.random() * canvas.width
      }
    }

    draw() {
      ctx.beginPath()
      if (mappedImage[this.position1] && mappedImage[this.position1][this.position2]) {
        ctx.fillStyle = mappedImage[this.position1][this.position2][1]
        ctx.strokeStyle = mappedImage[this.position1][this.position2][1]
      }

      // ctx.fillStyle = gradient1
      // ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      // ctx.strokeRect(this.x, this.y, this.size * 3, this.size * 3)
      ctx.font = '20px Arial'
      if (this.random < 0.02) {
        ctx.fillText(this.letter, this.x, this.y)
      } else {
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      }
      ctx.fill()
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle())
    }
  }

  init()

  function animate() {
    // ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height)

    ctx.globalAlpha = 0.05
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalAlpha = 0.2
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update()
      // ctx.globalAlpha = particlesArray[i].speed * 0.5
      ctx.globalAlpha = 1
      particlesArray[i].draw()
    }
    requestAnimationFrame(animate)
  }

  animate()
})
