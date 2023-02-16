const maxSpeed = 8
const minSpeed = 0.3

export class Ball {
	constructor(canvasWidth, canvasHeight, context, radius) {
		this.boostX = 0
		this.boostY = 0
		this.canvasHeight = canvasHeight
		this.canvasWidth = canvasWidth
		this.context = context

		this.minRadius = Math.min(canvasHeight, canvasWidth) * 0.1 * 0.2 //10%
		this.maxRadius = 0
		this.checkMaxRadius()
		this.radius = Math.random() * (this.maxRadius - this.minRadius) + this.minRadius
		if (radius) {
			this.radius = radius
		}
		if (this.radius < 5) {
			return null
		}

		this.speed = 0
		this.vx = 0
		this.vy = 0
		this.setSpeed()
		this.directionX = Math.floor((this.vx * 100) / this.speed)
		this.directionY = Math.ceil((this.vy * 100) / this.speed)

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
		if (this.boostX || this.boostY) {
			this.xPosition += this.boostX
			this.yPosition += this.boostY

			this.boostX = 0
			this.boostY = 0
		} else {
			this.xPosition += this.vx
			this.yPosition += this.vy
		}

		this.CheckIsBallInsideCanvas(width, height)

		this.context.beginPath()
		if (this.radius < 0) {
			return
		}
		this.context.arc(this.xPosition, this.yPosition, this.radius, 0, 2 * Math.PI)
		this.context.fillStyle = this.color
		this.context.fill()
		this.context.stroke()
		this.context.closePath()
	}

	CheckIsBallInsideCanvas(width, height) {
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
		if (this.xPosition < -1 + this.radius) {
			this.xPosition = this.radius
		}
		if (this.yPosition < -1 + this.radius) {
			this.yPosition = this.radius
		}
	}

	getPosition() {
		return [this.xPosition, this.yPosition]
	}

	transferPower(powerToChange, canvasWidth, canvasHeight) {
		this.canvasHeight = canvasHeight
		this.canvasWidth = canvasWidth
		const procent = (powerToChange * 100) / this.radius
		this.radius += powerToChange
		this.speed -= this.speed * ((procent * 1.1) / 100)
		if (this.speed < minSpeed && this.speed > 0) {
			this.speed = minSpeed
		} else if (this.speed > -minSpeed && this.speed < 0) {
			this.speed = -minSpeed
		}
		if (this.speed > maxSpeed) {
			this.speed = maxSpeed
		} else if (this.speed < -maxSpeed) {
			this.speed = -maxSpeed
		}

		this.changeSpeed()
	}

	setSpeed() {
		this.checkMaxRadius()
		const procent = 100 - (this.radius * 100) / this.maxRadius
		this.speed = procent / 10
		if (this.speed < minSpeed) {
			this.speed = minSpeed
		}
		if (this.speed > maxSpeed) {
			this.speed = maxSpeed
		}
		const tempVx = this.speed * Math.random()
		const tempVy = this.speed - tempVx
		if (!this.vx && !this.vy) {
			this.vx = tempVx
			this.vy = tempVy
			return
		}
	}

	changeSpeed() {
		const tempVx = this.speed * (this.directionX / 100)
		const tempVy = this.speed * (this.directionY / 100)

		this.vx = this.vx > 0 ? Math.abs(tempVx) : Math.abs(tempVx) * -1
		this.vy = this.vy > 0 ? Math.abs(tempVy) : Math.abs(tempVy) * -1
	}

	checkMaxRadius() {
		this.maxRadius = Math.min(this.canvasHeight, this.canvasWidth) * 0.2 * 0.4 // 80%
	}
}
