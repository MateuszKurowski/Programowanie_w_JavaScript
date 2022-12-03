document.addEventListener('keypress', onKeyPress)
const btn = document.querySelector('.Record')
const ms1 = document.querySelector('#ms1')

let isRecording = false

var constraints = {
	audio: true,
	video: false,
}

const sound = './sound'

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

const RecordAudio = () => {
	return new Promise(resolve => {
		navigator.mediaDevices.	({ audio: true, video: false }).then(stream => {
			const mediaRecorder = new MediaRecorder(stream)
			const audioChunks = []

			mediaRecorder.addEventListener('dataavailable', event => {
				audioChunks.push(event.data)
			})

			const start = () => {
				mediaRecorder.start()
			}

			const stop = () => {
				return new Promise(resolve => {
					mediaRecorder.addEventListener('stop', () => {
						const audioBlob = new Blob(audioChunks)
						const audioUrl = URL.createObjectURL(audioBlob)

						const audio = new Audio(audioUrl)
						if (window.URL) {
							ms1.srcObject = stream
						} else {
							ms1.src = stream
						}
						const play = () => {
							audio.play()
						}

						resolve({ audioBlob, audioUrl })
					})

					mediaRecorder.stop()
				})
			}

			resolve({ start, stop })
		})
	})
}

const sleep = time => new Promise(resolve => setTimeout(resolve, time))

;(async () => {
	const recorder = await RecordAudio()
	recorder.start()
	await sleep(3000)
	const audio = await recorder.stop()
	//audio.play()
})()

btn.addEventListener('click', RecordAudio)
