import { Background } from './models/Background.js'
import { Circle } from './models/Circle.js'

let amountOfCircles = document.querySelector('.circles-amount')
const startStopButton = document.querySelector('.start-stop-button')
const resetButton = document.querySelector('.reset-button')
let isStarted = true

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

function drawCircles() {
	if (!isStarted) {
		return
	}
	window.requestAnimationFrame(drawCircles)
	background.draw()
	playgroundCtx.clearRect(0, 0, getWidth(), getHeight())
	circles.forEach(circle => circle.draw(getWidth(), getHeight()))
}

const createCircles = amount => {
	for (let i = 0; i < amount; i++) {
		circles.push(new Circle(getWidth(), getHeight(), playgroundCtx))
	}
}

const addOrDeleteCircles = () => {
	console.log('addOrDeleteCircles')
	amountOfCircles = document.querySelector('.circles-amount')
	const amount = amountOfCircles.value

	if (!amount) {
		circles.splice(0, circles.length)
	} else if (amount < 0) {
		amountOfCircles.value = 0
		return
	} else if (amount == circles.length) {
		return
	} else if (amount > circles.length) {
		createCircles(amount - circles.length)
	} else {
		circles.splice(0, circles.length - amount)
	}
}

const startStop = () => {
	isStarted = !isStarted
	if (isStarted) {
		startStopButton.textContent = 'Stop'
		drawCircles()
	} else {
		startStopButton.textContent = 'Start'
	}
}

const reset = () => {
	circles.splice(0, circles.length)
	createCircles(amountOfCircles.defaultValue)
	amountOfCircles.value = amountOfCircles.defaultValue
	isStarted = true
	drawCircles()
}

window.addEventListener('resize', () => {
	setCanvasDimensions()
	background.draw()
	for (let i = 0; i < circles.length; i++) {
		const circle = circles[i]
		circle.draw(getWidth(), getHeight())
		if (circle.radius < 1) {
			circles.splice(i, 1)
		}
	}
})

createCircles(amountOfCircles.value)
setCanvasDimensions()
background.draw()
window.requestAnimationFrame(drawCircles)

amountOfCircles.addEventListener('change', addOrDeleteCircles)
startStopButton.addEventListener('click', startStop)
resetButton.addEventListener('click', reset)
