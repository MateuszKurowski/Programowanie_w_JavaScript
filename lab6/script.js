import { Background } from './models/Background.js'
import { Ball } from './models/Ball.js'

let amountOfBalls = document.querySelector('.circles-amount')
const startStopButton = document.querySelector('.start-stop-button')
const resetButton = document.querySelector('.reset-button')
let isStarted = true
let animationId

const canvasBackground = document.getElementById('canvas-background')
const canvasPlayground = document.getElementById('canvas-playground')
const backgroundCtx = canvasBackground.getContext('2d')
const playgroundCtx = canvasPlayground.getContext('2d')

const getWidth = () => window.innerWidth - 50
const getHeight = () => window.innerHeight - 130
const setCanvasDimensions = () => {
	canvasBackground.width = getWidth()
	canvasBackground.height = getHeight()
	canvasPlayground.width = getWidth()
	canvasPlayground.height = getHeight()
}

const background = new Background(backgroundCtx, getWidth(), 40)
const circles = []

const createBalls = amount => {
	for (let i = 0; i < amount; i++) {
		circles.push(new Ball(getWidth(), getHeight(), playgroundCtx))
	}
}

const addOrDeleteBalls = () => {
	amountOfBalls = document.querySelector('.circles-amount')
	const amount = amountOfBalls.value

	if (!amount) {
		circles.splice(0, circles.length)
	} else if (amount < 0) {
		amountOfBalls.value = 0
		return
	} else if (amount == circles.length) {
		return
	} else if (amount > circles.length) {
		createBalls(amount - circles.length)
	} else {
		circles.splice(0, circles.length - amount)
	}
}

const startStop = () => {
	isStarted = !isStarted
	if (isStarted) {
		startStopButton.textContent = 'Stop'
		drawBalls()
	} else {
		startStopButton.textContent = 'Start'
	}
}

const reset = () => {
	circles.splice(0, circles.length)
	playgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	backgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	backgroundCtx.reset()
	playgroundCtx.reset()
	setCanvasDimensions()
	background.draw()
	createBalls(amountOfBalls.defaultValue)
	amountOfBalls.value = amountOfBalls.defaultValue
	isStarted = true
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
	return Math.sqrt(x + y)
}

const transferPower = (firstBall, secondBall) => {
	const power = 0.02
	if (firstBall.radius > secondBall.radius) {
		firstBall.transferPower(power, getWidth(), getHeight())
		secondBall.transferPower(-power, getWidth(), getHeight())
	} else if (firstBall.radius < secondBall.radius) {
		firstBall.transferPower(-power, getWidth(), getHeight())
		secondBall.transferPower(power, getWidth(), getHeight())
	} else {
		if (Math.round(Math.random()) == 0) {
			firstBall.transferPower(power, getWidth(), getHeight())
			secondBall.transferPower(-power, getWidth(), getHeight())
		} else {
			firstBall.transferPower(-power, getWidth(), getHeight())
			secondBall.transferPower(power, getWidth(), getHeight())
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
	if (!isStarted) {
		return
	}
	playgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	for (let i = 0; i < circles.length; i++) {
		const circle = circles[i]
		circle.draw(getWidth(), getHeight())
		if (circle.radius < 5) {
			circles.splice(i, 1)
			continue
		}
		for (let j = i; j < circles.length; j++) {
			if (i == j) {
				continue
			}
			const firstCirle = circles[i]
			const secondBall = circles[j]
			try {
				const distance =
					getDistance(firstCirle.getPosition(), secondBall.getPosition()) - firstCirle.radius + secondBall.radius
				if (distance < 200) {
					drawLine(firstCirle.getPosition(), secondBall.getPosition())
					transferPower(firstCirle, secondBall)
				}
			} catch (error) {}
		}
	}
	animationId = window.requestAnimationFrame(drawBalls)
}

const divedBall = (firstBall, secondBall) => {
	
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
startStopButton.addEventListener('click', startStop)
resetButton.addEventListener('click', reset)
