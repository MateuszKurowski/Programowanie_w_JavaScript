import { Background } from './models/Background.js'
import { Ball } from './models/Ball.js'

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
