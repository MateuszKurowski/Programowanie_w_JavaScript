import { Background } from './models/Background.js'
import { Circle } from './models/Circle.js'

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

window.addEventListener('resize', () => {
	setCanvasDimensions()
	background.draw()
	circles.forEach(circle => circle.draw(getWidth(), getHeight()))
})

createCircles(5)
setCanvasDimensions()
background.draw()
window.requestAnimationFrame(drawCircles)
