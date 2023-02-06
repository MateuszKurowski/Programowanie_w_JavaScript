export class Circle {
	constructor(canvasWidth, canvasHeight, context, radius) {
		this.canvasHeight = canvasHeight
		this.canvasWidth = canvasWidth
		this.context = context

		const min = Math.min(canvasHeight, canvasWidth)
		const minRadius = Math.min(canvasHeight, canvasWidth) * 0.1 * 0.3 //10%
		const maxRadius = Math.min(canvasHeight, canvasWidth) * 0.5 * 0.2 // 80%
		console.log(min)
		console.log(minRadius)
		console.log(maxRadius)
		this.radius = !radius ? Math.random() * maxRadius + minRadius : radius

		const speed = Math.random() * 10 + 1
		this.vx = speed - Math.random() * 10
		this.vy = speed - this.vx

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

		this.context.beginPath()
		this.context.arc(this.xPosition, this.yPosition, this.radius, 0, 2 * Math.PI)
		this.context.fillStyle = this.color
		this.context.fill()
		this.context.stroke()
		this.context.closePath()
	}
}
