const images = document.querySelectorAll('img')
const dotsContainer = document.querySelector('.dots')
const perviousBtn = document.querySelector('.previous')
const nextBtn = document.querySelector('.next')
let currentImage = 0
let activeDot = 0
let animationInterval
let rightDirection = true

for (let i = 0; i < images.length; i++) {
	const dot = document.createElement('button')
	dot.classList.add('dot')
	dot.setAttribute('data-index', i)
	dotsContainer.append(dot)
}
dotsContainer.querySelector('.dot').style.backgroundColor = '#717171'
const dots = dotsContainer.querySelectorAll('.dot')

const NextImage = () => {
	if (currentImage == 0) perviousBtn.disabled = false
	let currentPos = 0
	const Frame = () => {
		for (const image of images) {
			image.style.transform = `translateX(${-1 * currentImage * 600 + currentPos}px)`
		}
		currentPos -= 5
		if (currentPos % 600 == 0) {
			for (const image of images) {
				image.style.transform = `translateX(${-1 * currentImage * 600 + currentPos}px)`
			}
			currentPos = 0
			currentImage++

			if (currentImage == images.length - 1) nextBtn.disabled = true

			ChangeActiveDot()

			clearInterval(intervalId)
		}
	}

	if (currentImage >= images.length - 1) return
	let intervalId = null
	clearInterval(intervalId)
	intervalId = setInterval(Frame, 7)
}

const PreviousImage = () => {
	if (currentImage == images.length - 1) nextBtn.disabled = false
	let currentPos = 0
	const Frame = () => {
		for (const image of images) {
			image.style.transform = `translateX(${-1 * 600 * currentImage - currentPos}px)`
		}
		currentPos -= 5
		if (currentPos % 600 == 0) {
			for (const image of images) {
				image.style.transform = `translateX(${-1 * 600 * currentImage - currentPos}px)`
			}
			currentPos = 0
			currentImage--

			if (currentImage == 0) perviousBtn.disabled = true

			ChangeActiveDot()

			clearInterval(intervalId)
		}
	}

	if (currentImage <= 0) return
	let intervalId = null
	clearInterval(intervalId)
	intervalId = setInterval(Frame, 7)
}

const ChangeActiveDot = () => {
	dots.item(activeDot).style.backgroundColor = '#bbb'
	dots.item(currentImage).style.backgroundColor = '#717171'
	activeDot = currentImage
}

const ChangeImage = e => {
	let index = e.target.getAttribute('data-index')
	dots.item(activeDot).style.backgroundColor = '#bbb'
	dots.item(index).style.backgroundColor = '#717171'
	activeDot = index
	let currentPos = currentImage * 600 * -1
	let targetPos = index * 600 * -1

	const FramePlus = () => {
		for (const image of images) {
			image.style.transform = `translateX(${currentPos}px)`
		}
		currentPos -= 20
		if (currentPos < targetPos) {
			if (index == 0) {
				perviousBtn.disabled = true
				nextBtn.disabled = false
			} else if (index == images.length - 1) {
				nextBtn.disabled = true
				perviousBtn.disabled = false
			} else {
				perviousBtn.disabled = false
				nextBtn.disabled = false
			}
			currentImage = index
			clearInterval(intervalId)
		}
	}

	const FrameMinus = () => {
		for (const image of images) {
			image.style.transform = `translateX(${currentPos}px)`
		}
		currentPos += 20
		if (currentPos > targetPos) {
			if (index == 0) {
				perviousBtn.disabled = true
				nextBtn.disabled = false
			} else if (index == images.length - 1) {
				nextBtn.disabled = true
				perviousBtn.disabled = false
			} else {
				perviousBtn.disabled = false
				nextBtn.disabled = false
			}
			currentImage = index
			clearInterval(intervalId)
		}
	}

	let intervalId = null
	clearInterval(intervalId)

	if (currentImage > index) intervalId = setInterval(FrameMinus, 7)
	else intervalId = setInterval(FramePlus, 7)
}

const SliderAnimation = () => {
	let currentPos = currentImage * 600 * -1

	if (currentImage == images.length - 1) rightDirection = false
	if (currentImage == 0) rightDirection = true

	let targetPos = rightDirection ? currentPos - 600 : currentPos + 600

	if (rightDirection) {
		NextImage()
	} else {
		PreviousImage()
	}
}

perviousBtn.addEventListener('click', PreviousImage)
nextBtn.addEventListener('click', NextImage)
dots.forEach(x => x.addEventListener('click', ChangeImage))

animationInterval = setInterval(SliderAnimation, 5000)
