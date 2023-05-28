class Microphone {
  constructor(fftSize) {
    this.initialized = false
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
          this.audioContext = new AudioContext()
          this.microphone = this.audioContext.createMediaStreamSource(stream)
          this.analyzer = this.audioContext.createAnalyser()
          this.analyzer.fftSize = fftSize
          const bufferLength = this.analyzer.frequencyBinCount
          this.dataArray = new Uint8Array(bufferLength)
          this.microphone.connect(this.analyzer)
          this.initialized = true
        })
        .catch(err => {
          alert(err)
        })
  }

  getSamples() {
    this.analyzer.getByteTimeDomainData(this.dataArray)
    return Array.from(this.dataArray).map(e => e / 128 - 1)
  }

  getVolume() {
    const normSamples = this.getSamples()
    let sum = 0
    for (let i = 0; i < normSamples.length; i++) {
      sum += normSamples[i] ** 2
    }
    return Math.sqrt(sum / normSamples.length)
  }
}
