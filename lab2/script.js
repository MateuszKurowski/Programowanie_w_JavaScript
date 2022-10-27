const slides = document.querySelectorAll('.slide')
const dotsContainer = document.querySelector('.dots')
const perviousBtn = document.querySelector('.previous')
const pauseBtn = document.querySelector('.pause')
const nextBtn = document.querySelector('.next')
const slideAnimationBtn = document.querySelector('.checkAnimation')
const aside = document.querySelector('aside')
const mediaArray = []
for (const slide of slides) {
	const image = slide.querySelector('img')
	const video = slide.querySelector('video')
	if (image) mediaArray.push(image)
	if (video) mediaArray.push(video)
}
let paused = false
let crossfadingAnimation = false
let currentSlide = 0
let activeDot = 0
let animationInterval
let rightDirection = true

const ButtonHandler = index => {
	if (index == 0) {
		perviousBtn.disabled = true
		nextBtn.disabled = false
	} else if (index == slides.length - 1) {
		nextBtn.disabled = true
		perviousBtn.disabled = false
	} else {
		perviousBtn.disabled = false
		nextBtn.disabled = false
	}
}

for (let i = 0; i < slides.length; i++) {
	const dot = document.createElement('button')
	dot.classList.add('dot')
	dot.setAttribute('data-index', i)
	dotsContainer.append(dot)
}
dotsContainer.querySelector('.dot').style.backgroundColor = '#717171'
const dots = dotsContainer.querySelectorAll('.dot')

const DisableButtons = () => {
	dots.forEach(x => x.removeEventListener('click', ChangeSlide))
	perviousBtn.disabled = true
	pauseBtn.disabled = true
	nextBtn.disabled = true
}

const EnableButtons = () => {
	dots.forEach(x => x.addEventListener('click', ChangeSlide))
	perviousBtn.disabled = false
	pauseBtn.disabled = false
	nextBtn.disabled = false
}

const NextSlide = () => {
	DisableButtons()
	clearInterval(animationInterval)
	let currentPos = 0
	let currentSlideOpacity = 1
	let currentNextSlideOpacity = 0
	const crossfadeAnimation = () => {
		slides[currentSlide].style.opacity = currentSlideOpacity
		slides[currentSlide + 1].style.opacity = currentNextSlideOpacity
		currentSlideOpacity -= 0.01
		currentNextSlideOpacity += 0.01

		if (currentNextSlideOpacity >= 1) {
			slides[currentSlide + 1].style.opacity = 1
			slides[currentSlide].style.transform = `translateX(${-1 * (currentSlide + 1) * 600}px)`
			slides[currentSlide].style.opacity = 1
			currentSlide++
			ChangeActiveDot()
			EnableButtons()
			if (currentSlide == slides.length - 1) nextBtn.disabled = false
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			clearInterval(intervalId)
		}
	}

	const NextAnimation = () => {
		for (const slide of slides) {
			slide.style.transform = `translateX(${-1 * currentSlide * 600 + currentPos}px)`
		}
		currentPos -= 5
		if (currentPos % 600 == 0) {
			for (const slide of slides) {
				slide.style.transform = `translateX(${-1 * currentSlide * 600 + currentPos}px)`
			}
			currentPos = 0
			currentSlide++

			ChangeActiveDot()
			EnableButtons()
			if (currentSlide == slides.length - 1) nextBtn.disabled = false
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			clearInterval(intervalId)
		}
	}

	if (currentSlide >= slides.length - 1) return
	let intervalId = null
	clearInterval(intervalId)
	if (crossfadingAnimation) {
		for (let i = 0; i < slides.length; i++) {
			if (i == currentSlide) continue
			if (i == currentSlide + 1) slides[i].style.opacity = '0'
			slides[i].style.transform = `translateX(${-1 * (currentSlide + 1) * 600}px)`
		}
		intervalId = setInterval(crossfadeAnimation, 7)
	} else {
		intervalId = setInterval(NextAnimation, 7)
	}
	// if (!paused) animationInterval = setInterval(SliderAnimation, 3000)
	// EnableButtons()
	// if (currentSlide == 0) perviousBtn.disabled = false
}

const PreviousSlide = () => {
	DisableButtons()
	clearInterval(animationInterval)
	if (currentSlide == slides.length - 1) nextBtn.disabled = false
	let currentPos = 0
	let currentSlideOpacity = 1
	let currentNextSlideOpacity = 0
	const crossfadeAnimation = () => {
		slides[currentSlide].style.opacity = currentSlideOpacity
		slides[currentSlide - 1].style.opacity = currentNextSlideOpacity
		currentSlideOpacity -= 0.01
		currentNextSlideOpacity += 0.01

		if (currentNextSlideOpacity >= 1) {
			slides[currentSlide - 1].style.opacity = 1
			slides[currentSlide].style.transform = `translateX(${-1 * (currentSlide - 1) * 600}px)`
			slides[currentSlide].style.opacity = 1
			currentSlide--
			ChangeActiveDot()
			EnableButtons()
			if (currentSlide == 0) perviousBtn.disabled = true
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			clearInterval(intervalId)
		}
	}

	const NextAnimation = () => {
		for (const slide of slides) {
			slide.style.transform = `translateX(${-1 * 600 * currentSlide - currentPos}px)`
		}
		currentPos -= 5
		if (currentPos % 600 == 0) {
			for (const slide of slides) {
				slide.style.transform = `translateX(${-1 * 600 * currentSlide - currentPos}px)`
			}
			currentPos = 0
			currentSlide--

			ChangeActiveDot()
			EnableButtons()
			if (currentSlide == 0) perviousBtn.disabled = true
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			clearInterval(intervalId)
		}
	}

	if (currentSlide <= 0) return
	let intervalId = null
	clearInterval(intervalId)
	if (crossfadingAnimation) {
		for (let i = 0; i < slides.length; i++) {
			if (i == currentSlide) continue
			if (i == currentSlide - 1) slides[i].style.opacity = '0'
			slides[i].style.transform = `translateX(${-1 * (currentSlide - 1) * 600}px)`
		}
		intervalId = setInterval(crossfadeAnimation, 7)
	} else {
		intervalId = setInterval(NextAnimation, 7)
	}
	// if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
	// EnableButtons()
	// if (currentSlide == slides.length - 1) nextBtn.disabled = false
}

const ChangeActiveDot = () => {
	dots.item(activeDot).style.backgroundColor = '#bbb'
	dots.item(currentSlide).style.backgroundColor = '#717171'
	activeDot = currentSlide
}

const ChangeSlide = e => {
	DisableButtons()
	clearInterval(animationInterval)
	let index = parseInt(e.target.getAttribute('data-index'))
	dots.item(activeDot).style.backgroundColor = '#bbb'
	dots.item(index).style.backgroundColor = '#717171'
	activeDot = index
	let currentPos = currentSlide * 600 * -1
	let targetPos = index * 600 * -1
	let currentSlideOpacity = 1
	let currentNextSlideOpacity = 0

	const CrossfadeAnimationPlus = () => {
		slides[currentSlide].style.opacity = currentSlideOpacity
		slides[index].style.opacity = currentNextSlideOpacity
		currentSlideOpacity -= 0.01
		currentNextSlideOpacity += 0.01

		if (currentNextSlideOpacity >= 1) {
			slides[index].style.opacity = 1
			slides[currentSlide].style.transform = `translateX(${-1 * index * 600}px)`
			slides[currentSlide].style.opacity = 1
			currentSlide = index
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			EnableButtons()
			ButtonHandler(index)
			clearInterval(intervalId)
		}
	}

	const NextAnimationPlus = () => {
		for (const slide of slides) {
			slide.style.transform = `translateX(${currentPos}px)`
		}
		currentPos -= 20
		if (currentPos < targetPos) {
			currentSlide = index
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			EnableButtons()
			ButtonHandler(index)
			clearInterval(intervalId)
		}
	}

	const CrossfadeingAnimationMinus = () => {
		slides[currentSlide].style.opacity = currentSlideOpacity
		slides[index].style.opacity = currentNextSlideOpacity
		currentSlideOpacity -= 0.01
		currentNextSlideOpacity += 0.01

		if (currentNextSlideOpacity >= 1) {
			slides[index].style.opacity = 1
			slides[currentSlide].style.transform = `translateX(${-1 * index * 600}px)`
			slides[currentSlide].style.opacity = 1
			currentSlide = index
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			EnableButtons()
			ButtonHandler(index)
			clearInterval(intervalId)
		}
	}

	const NextAnimationMinus = () => {
		for (const slide of slides) {
			slide.style.transform = `translateX(${currentPos}px)`
		}
		currentPos += 20
		if (currentPos > targetPos) {
			currentSlide = index
			if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
			EnableButtons()
			ButtonHandler(index)
			clearInterval(intervalId)
		}
	}

	let intervalId = null
	clearInterval(intervalId)

	if (currentSlide > index) {
		if (crossfadingAnimation) {
			for (let i = 0; i < slides.length; i++) {
				if (i == currentSlide) continue
				if (i == index) slides[i].style.opacity = '0'
				slides[i].style.transform = `translateX(${-1 * index * 600}px)`
			}
			intervalId = setInterval(CrossfadeAnimationPlus, 7)
		} else {
			intervalId = setInterval(NextAnimationMinus, 7)
		}
	} else {
		if (crossfadingAnimation) {
			for (let i = 0; i < slides.length; i++) {
				if (i == currentSlide) continue
				if (i == index) slides[i].style.opacity = '0'
				slides[i].style.transform = `translateX(${-1 * index * 600}px)`
			}
			intervalId = setInterval(CrossfadeingAnimationMinus, 7)
		} else {
			intervalId = setInterval(NextAnimationPlus, 7)
		}
	}
}

const SliderAnimation = () => {
	if (currentSlide == slides.length - 1) rightDirection = false
	if (currentSlide == 0) rightDirection = true

	if (rightDirection) {
		NextSlide()
	} else {
		PreviousSlide()
	}
}

const PauseSliderAnimation = () => {
	if (pauseBtn.textContent == '⏸️') {
		pauseBtn.textContent = '▶️'
		clearInterval(animationInterval)
		paused = true
	} else if (pauseBtn.textContent == '▶️') {
		pauseBtn.textContent = '⏸️'
		paused = false
		animationInterval = setInterval(SliderAnimation, 4000)
	}
}

const CreateLighBox = e => {
	clearInterval(animationInterval)
	const popup = document.createElement('div')
	const media = e.target.cloneNode()
	popup.classList.add('popup')
	popup.append(media)
	aside.append(popup)
	aside.classList.remove('hide')
}

const CloseLightBox = () => {
	const popup = document.querySelector('aside>div')
	aside.classList.add('hide')
	popup.remove()
	if (!paused) animationInterval = setInterval(SliderAnimation, 4000)
}

perviousBtn.addEventListener('click', PreviousSlide)
nextBtn.addEventListener('click', NextSlide)
dots.forEach(x => x.addEventListener('click', ChangeSlide))

animationInterval = setInterval(SliderAnimation, 4000)
pauseBtn.addEventListener('click', PauseSliderAnimation)

slideAnimationBtn.addEventListener('click', () => {
	crossfadingAnimation = crossfadingAnimation ? false : true
})

for (const media of mediaArray) {
	media.addEventListener('click', CreateLighBox)
}

aside.addEventListener('click', CloseLightBox)
