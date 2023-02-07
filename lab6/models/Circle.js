export class Circle {
	constructor(canvasWidth, canvasHeight, context) {
		this.canvasHeight = canvasHeight
		this.canvasWidth = canvasWidth
		this.context = context

		const min = Math.min(canvasHeight, canvasWidth)
		const minRadius = Math.min(canvasHeight, canvasWidth) * 0.1 * 0.2 //10%
		const maxRadius = Math.min(canvasHeight, canvasWidth) * 0.2 * 0.4 // 80%
		this.radius = Math.random() * (maxRadius - minRadius) + minRadius

		const procent = 100 - ((this.radius * 100) / maxRadius)
		const speed = procent / 10
		// console.log(maxRadius)
		// console.log(`Radius=${this.radius} ; Speed=${speed}`)
		// const speed = Math.random() * 10 + 1
		this.vx = speed * Math.random()
		this.vy = speed - this.vx
		// console.log(`vx=${this.vx} ; vy=${this.vy}`)
		// console.log(`sum=${this.vx + this.vy}`)

		this.color =
			'rgb(' +
			Math.floor(Math.random() * 256) +
			',' +
			Math.floor(Math.random() * 256) +
			',' +
			Math.floor(Math.random() * 256) +
			')'

		this.xPosition =
			Math.random() * (Math.floor(this.canvasWidth) - Math.ceil(this.radius * 2)) + Math.ceil(this.radius)
		this.yPosition = Math.floor(
			Math.random() * (Math.floor(this.canvasHeight) - Math.ceil(this.radius * 2)) + Math.ceil(this.radius)
		)
	}

	draw(width, height) {
		this.xPosition += this.vx
		this.yPosition += this.vy

		if (this.xPosition > width - this.radius || this.xPosition < this.radius) {
			this.vx = -this.vx
		}
		if (this.yPosition > height - this.radius || this.yPosition < this.radius) {
			this.vy = -this.vy
		}
		if (this.xPosition >= width - this.radius) {
			this.xPosition = width - this.radius
		}
		if (this.yPosition >= height - this.radius) {
			this.yPosition = height - this.radius
		}
		if (this.xPosition < 0 + this.radius) {
			this.xPosition = this.radius
		}
		if (this.yPosition < 0 + this.radius) {
			this.yPosition = this.radius
		}

		this.context.beginPath()
		this.context.arc(this.xPosition, this.yPosition, this.radius, 0, 2 * Math.PI)
		this.context.fillStyle = this.color
		this.context.fill()
		this.context.stroke()
		this.context.closePath()
	}
}
