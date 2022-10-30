document.addEventListener('keypress', onKeyPress)
const btn = document.querySelector('.test')
btn.addEventListener('click', RecordAudio)

const sounds = './sound'
console.log(sounds);
console.log(open(sounds));

const KeyToSound = {
	a: document.querySelector('#s1'),
	s: document.querySelector('#s2'),
	d: document.querySelector('#s3'),
	f: document.querySelector('#s4'),
	g: document.querySelector('#s5'),
	h: document.querySelector('#s6'),
	j: document.querySelector('#s7'),
	k: document.querySelector('#s8'),
	l: document.querySelector('#s9'),
}

function playSound(sound) {
	sound.currentTime = 0
	sound.play()
}

function onKeyPress(event) {
	const sound = KeyToSound[event.key]
	playSound(sound)
}

function RecordAudio() {
	let stream

}

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
	console.log('getUserMedia supported.')
	navigator.mediaDevices
		.getUserMedia(
			// constraints - only audio needed for this app
			{
				audio: true,
			}
		)

		// Success callback
		.then(stream => {})

		// Error callback
		.catch(err => {
			console.error(`The following getUserMedia error occurred: ${err}`)
		})
} else {
	console.log('getUserMedia not supported on your browser!')
}
