function main() {
  /**
   * @type {HTMLCanvasElement}
   */
  const canvas = document.getElementById('myCanvas')
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight


  class Bar {
    constructor(x, y, width, height, color, index) {
      this.x = x
      this.y = y
      this.width = width
      this.height = height
      this.color = color
      this.index = index
    }

    update(macInput) {
      const sound = macInput * 1000
      if (sound > this.height) {
        this.height = sound
      } else {
        this.height -= this.height * 0.03
      }
    }

    draw(context, volume) {
      context.strokeStyle = this.color
      context.save()
      // context.translate(canvas.width / 2, canvas.height / 2)
      context.rotate(this.index * 0.03)
      context.scale(1 + volume * 0.2, 1 + volume * 0.2)

      context.beginPath()
      // context.moveTo(this.x, this.y)
      // context.lineTo(0, this.height)
      context.bezierCurveTo(100, 0, this.height, this.height, this.x * 2, this.y * 2)
      context.stroke()
      context.rotate(this.index * 0.02)
      // context.strokeRect(this.x, this.index, this.height / 2, this.height)

      context.beginPath()
      context.arc(this.x + this.index * 2.5, this.y, this.height * 0.2, 0, Math.PI * 2)
      context.stroke()
      context.restore()
    }
  }

  const fftSize = 512
  const microphone = new Microphone(fftSize)
  const bars = []
  const barWidth = canvas.width / (fftSize / 2)

  function createBars() {
    for (let i = 0; i < fftSize / 2; i++) {
      const color = `hsl(${i * 2}, 100%, 50%)`
      bars[bars.length] = new Bar(0, i * 1.5, 5, 20, color, i)
    }
  }

  createBars()
  let angle = 0

  function animate() {
    if (microphone.initialized) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const samples = microphone.getSamples()
      const volume = microphone.getVolume()

      angle -= 0.01 + volume * 0.05
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(angle)
      bars.forEach((bar, i) => {
        bar.update(samples[i])
        bar.draw(ctx, volume)
      })
      ctx.restore()
    }
    requestAnimationFrame(animate)
  }

  animate()
}

