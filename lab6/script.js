class Background {
	constructor(context, width, rectAmountInRow) {
		this.context = context
		this.xPosition = 0
		this.yPosition = 0
		this.rectAmountInRow = rectAmountInRow % 2 == 0 ? rectAmountInRow : rectAmountInRow + 1
		this.rectSize = width / rectAmountInRow
		this.colorsRows = []
		for (let i = 1; i <= this.rectAmountInRow; i++) {
			const row = []
			for (let j = 1; j <= this.rectAmountInRow; j++) {
				const color = []
				color.push(Math.round(Math.abs(Math.sin((Date.now() * i) / 50)) * 50))
				color.push(Math.round(Math.abs(Math.sin((Date.now() * i) / 200)) * 50))
				color.push(Math.round((this.b = Math.abs(Math.sin((Date.now() * i) / 100)) * 50)))
				row.push(color)
			}
			this.colorsRows.push(row)
		}
	}

	draw() {
		this.xPosition = 0
		this.yPosition = 0
		for (let i = 0; i < this.rectAmountInRow; i++) {
			for (let j = 0; j < this.rectAmountInRow; j++) {
				this.context.fillStyle = `rgb(${this.colorsRows[i][j][0]}, ${this.colorsRows[i][j][1]}, ${this.colorsRows[i][j][2]})`
				this.context.fillRect(this.xPosition, this.yPosition, this.rectSize, this.rectSize)
				this.xPosition += this.rectSize
			}
			this.xPosition = 0
			this.yPosition += this.rectSize
		}
	}
}

const maxSpeed = 8
const minSpeed = 0.3

class Ball {
	constructor(canvasWidth, canvasHeight, context, radius) {
		this.canvasHeight = canvasHeight
		this.canvasWidth = canvasWidth
		this.context = context
		this.cursonInCanvas = false
		this.cursorX = 0
		this.cursorY = 0
		this.powerType = 'pull'

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

	draw(width, height, powerText) {
		if (this.cursonInCanvas) {
			const power = parseInt(powerText) / 100
			if (Math.round(this.xPosition) == this.cursorX && Math.round(this.yPosition) == this.cursorY) {
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
				this.cursonInCanvas = false
			}

			let a = 0
			if (this.cursorX - this.xPosition == 0) {
				a = 0
			} else {
				a = (this.cursorY - this.yPosition) / (this.cursorX - this.xPosition)
			}
			const b = this.yPosition - a * this.xPosition

			if (Math.abs(this.cursorX - (this.xPosition + power) < 3)) {
				//Y
				if (this.powerType == 'pull') {
					if (this.yPosition < this.cursorY) {
						if (this.yPosition + power >= this.cursorY) this.yPosition = this.cursorY
						else this.yPosition = this.yPosition + power
					} else if (this.yPosition > this.cursorY) {
						if (this.yPosition - power <= this.cursorY) this.yPosition = this.cursorY
						else this.yPosition = this.yPosition - power
					}

					if (a !== 0) this.xPosition = (this.yPosition - b) / a
				} else if (this.powerType == 'push') {
					if (this.yPosition > this.cursorY) this.yPosition = this.yPosition + power
					else if (this.yPosition < this.cursorY) this.yPosition = this.yPosition - power

					if (a !== 0) this.xPosition = (this.yPosition - b) / a
				} else {
					this.xPosition += this.vx
					this.yPosition += this.vy
				}
			} else {
				//X
				if (this.powerType == 'pull') {
					if (this.xPosition < this.cursorX) {
						if (this.xPosition + power >= this.cursorX) this.xPosition = this.cursorX
						else this.xPosition = this.xPosition + power
					} else if (this.xPosition > this.cursorX) {
						if (this.xPosition - power <= this.cursorX) this.xPosition = this.cursorX
						else this.xPosition = this.xPosition - power
					}

					this.yPosition = a * this.xPosition + b
				} else if (this.powerType == 'push') {
					if (this.xPosition > this.cursorX) this.xPosition = this.xPosition + power
					else if (this.xPosition < this.cursorX) this.xPosition = this.xPosition - power

					this.yPosition = a * this.xPosition + b
				} else {
					this.xPosition += this.vx
					this.yPosition += this.vy
				}
			}
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
		this.cursonInCanvas = false
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

let amountOfBalls = document.querySelector('.balls-amount')
let powerTransfer = document.querySelector('.transfer-power')
let powerTransferRange = document.querySelector('.transfer-power-range')
const startStopButton = document.querySelector('.start-stop-button')
const resetButton = document.querySelector('.reset-button')
let typeOfPower = document.getElementsByClassName('power-type')
let typeOfPoweChecked = document.querySelector('input[name="type"]:checked')
let powerRange = document.querySelector('.power-range')
let power = document.querySelector('.power')
let powerOn = document.querySelector('.power-on')

let isStarted = true
let animationId
let cursorInCanvas = false
let cursorPosition

const canvasBackground = document.getElementById('canvas-background')
const canvasPlayground = document.getElementById('canvas-playground')
const backgroundCtx = canvasBackground.getContext('2d')
const playgroundCtx = canvasPlayground.getContext('2d')

const getWidth = () => window.innerWidth - 50
const getHeight = () => window.innerHeight - 160
const setCanvasDimensions = () => {
	canvasBackground.width = getWidth()
	canvasBackground.height = getHeight()
	canvasPlayground.width = getWidth()
	canvasPlayground.height = getHeight()
}

const background = new Background(backgroundCtx, getWidth(), 40)
const balls = []

const createBalls = amount => {
	for (let i = 0; i < amount; i++) {
		const ball = new Ball(getWidth(), getHeight(), playgroundCtx)
		if (ball && ball.radius > 2) {
			balls.push(ball)
		}
	}
}

const addOrDeleteBalls = () => {
	amountOfBalls = document.querySelector('.balls-amount')
	const amount = amountOfBalls.value

	if (!amount) {
		balls.splice(0, balls.length)
	} else if (amount < 0) {
		amountOfBalls.value = 0
		return
	} else if (amount == balls.length) {
		return
	} else if (amount > balls.length) {
		createBalls(amount - balls.length)
	} else {
		balls.splice(0, balls.length - amount)
	}
}

const startStop = () => {
	isStarted = !isStarted
	if (isStarted) {
		startStopButton.textContent = 'Stop'
		animationId = window.requestAnimationFrame(drawBalls)
	} else {
		startStopButton.textContent = 'Start'
		window.cancelAnimationFrame(animationId)
	}
}

const reset = () => {
	balls.splice(0, balls.length)
	playgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	backgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	backgroundCtx.reset()
	playgroundCtx.reset()
	setCanvasDimensions()
	background.draw()
	createBalls(amountOfBalls.defaultValue)
	amountOfBalls.value = amountOfBalls.defaultValue
	window.cancelAnimationFrame(animationId)
	animationId = window.requestAnimationFrame(drawBalls)
}

const getDistance = (distanceI, distanceJ) => {
	const x1 = distanceI[0]
	const y1 = distanceI[1]
	const x2 = distanceJ[0]
	const y2 = distanceJ[1]

	const x = Math.pow(x2 - x1, 2)
	const y = Math.pow(y2 - y1, 2)
	return Math.abs(Math.sqrt(x + y))
}

const transferPower = (firstBall, secondBall) => {
	const powerToTransfer = parseInt(powerTransfer.value) / 1000
	if (firstBall.radius > secondBall.radius) {
		firstBall.transferPower(powerToTransfer, getWidth(), getHeight())
		secondBall.transferPower(-powerToTransfer, getWidth(), getHeight())
	} else if (firstBall.radius < secondBall.radius) {
		firstBall.transferPower(-powerToTransfer, getWidth(), getHeight())
		secondBall.transferPower(powerToTransfer, getWidth(), getHeight())
	} else {
		if (Math.round(Math.random()) == 0) {
			firstBall.transferPower(powerToTransfer, getWidth(), getHeight())
			secondBall.transferPower(-powerToTransfer, getWidth(), getHeight())
		} else {
			firstBall.transferPower(-powerToTransfer, getWidth(), getHeight())
			secondBall.transferPower(powerToTransfer, getWidth(), getHeight())
		}
	}
}

const drawLine = (firstCirlePosition, secondCirlePosition) => {
	playgroundCtx.beginPath()
	playgroundCtx.strokeStyle = 'white'
	playgroundCtx.moveTo(firstCirlePosition[0], firstCirlePosition[1])
	playgroundCtx.lineTo(secondCirlePosition[0], secondCirlePosition[1])
	playgroundCtx.stroke()
	playgroundCtx.closePath()
	playgroundCtx.strokeStyle = 'black'
}

function drawBalls() {
	playgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	for (let i = 0; i < balls.length; i++) {
		const ball = balls[i]
		ball.draw(getWidth(), getHeight(), power.value)
		if (ball.radius * 2 < 5) {
			balls.splice(i, 1)
			continue
		}
		if (ball.radius * 2 >= Math.min(getHeight(), getWidth()) * 0.7) {
			divedBall(ball)
		}
		if (powerOn.checked && cursorInCanvas) {
			const distance = getDistance(ball.getPosition(), cursorPosition) - ball.radius
			if (distance < powerRange.value) {
				addPowerToBall(ball)
			}
		}

		for (let j = i; j < balls.length; j++) {
			if (i == j) {
				continue
			}
			const firstCirle = balls[i]
			const secondBall = balls[j]
			try {
				const distance =
					getDistance(firstCirle.getPosition(), secondBall.getPosition()) - firstCirle.radius - secondBall.radius
				if (distance < powerTransferRange.value) {
					drawLine(firstCirle.getPosition(), secondBall.getPosition())
					transferPower(firstCirle, secondBall)
				}
			} catch (error) {}
		}
	}
	animationId = window.requestAnimationFrame(drawBalls)
}

const divedBall = ball => {
	if (ball.radius < 5) {
		const index = balls.findIndex(x => x == ball)
		balls.slice(index, 1)
		return
	}
	const secondBall = new Ball(getWidth(), getHeight(), playgroundCtx, ball.radius / 2)
	ball.transferPower(-(ball.radius / 2), getWidth(), getHeight())
	secondBall.yPosition = ball.yPosition
	secondBall.xPosition = ball.xPosition - ball.radius
	ball.setSpeed()
	secondBall.setSpeed()
	secondBall.vx = ball.vx > 0 ? -Math.abs(secondBall.vx) : Math.abs(secondBall.vx)
	secondBall.vy = ball.vy > 0 ? -Math.abs(secondBall.vy) : Math.abs(secondBall.vy)
	balls.push(secondBall)
}

const getCursorPosition = event => {
	const x = event.offsetX
	const y = event.offsetY
	return [x, y]
}

const addPowerToBall = ball => {
	ball.cursorX = cursorPosition[0]
	ball.cursorY = cursorPosition[1]
	ball.cursonInCanvas = cursorInCanvas
	ball.powerType = typeOfPoweChecked.id
}

setCanvasDimensions()
background.draw()
createBalls(amountOfBalls.value)
animationId = window.requestAnimationFrame(drawBalls)

window.addEventListener('resize', () => {
	setCanvasDimensions()
	background.draw()
})
amountOfBalls.addEventListener('change', addOrDeleteBalls)
powerOn.addEventListener('change', () => !powerOn)
powerRange.addEventListener('change', () => (powerRange = document.querySelector('.power-range')))
powerTransfer.addEventListener('change', () => (powerTransfer = document.querySelector('.transfer-power')))
powerTransferRange.addEventListener(
	'change',
	() => (powerTransferRange = document.querySelector('.transfer-power-range'))
)
power.addEventListener('change', () => (power = document.querySelector('.power')))
for (let index = 0; index < typeOfPower.length; index++) {
	typeOfPower[index].addEventListener('change', () => {
		typeOfPoweChecked = document.querySelector('input[name="type"]:checked')
	})
}
startStopButton.addEventListener('click', startStop)
resetButton.addEventListener('click', reset)
canvasPlayground.addEventListener('click', e => {
	window.cancelAnimationFrame(animationId)

	const lastCurosrPosition = getCursorPosition(e)
	for (let i = 0; i < balls.length; i++) {
		const ball = balls[i]
		const distance = getDistance(lastCurosrPosition, ball.getPosition())
		if (distance <= ball.radius) {
			divedBall(ball)
			break
		}
	}
	animationId = window.requestAnimationFrame(drawBalls)
})

canvasPlayground.addEventListener('mousemove', e => {
	if (!powerOn.checked) return

	window.cancelAnimationFrame(animationId)
	cursorPosition = getCursorPosition(e)
	animationId = window.requestAnimationFrame(drawBalls)
})

canvasPlayground.addEventListener('mouseenter', e => {
	cursorInCanvas = true
})

canvasPlayground.addEventListener('mouseleave', e => {
	cursorInCanvas = false
})

let before, now, fps
before = Date.now()
fps = 0
requestAnimationFrame(function loop() {
	now = Date.now()
	fps = Math.round(1000 / (now - before))
	before = now
	requestAnimationFrame(loop)
	console.log('fps', fps)
})
