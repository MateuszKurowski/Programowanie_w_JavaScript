const btnRecord = document.querySelector('.record')
const btnPlaySelectedSound = document.querySelector('.playSelected')
const btnPlayAllSound = document.querySelector('.playAll')
const recordPaths = document.querySelector('.recordAudioMenu').querySelectorAll('input')
const audioPaths = document.querySelector('.playAudioMenu').querySelectorAll('input')
const sound = './sound'
let isRecording = false
const recordedPaths = []
let currentRecodingPath = 0
let startRecordTime

recordPaths.forEach(x => recordedPaths.push([]))

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

const playSound = sound => {
	sound.currentTime = 0
	sound.play()
}

const onKeyPress = event => {
	const sound = KeyToSound[event.key]
	if (!sound) return
	if (isRecording) {
		const note = {
			sound: sound,
			startTime: Date.now() - startRecordTime,
		}
		recordedPaths[currentRecodingPath].push(note)
	}
	playSound(sound)
}

const toggleRecording = () => {
	if (isRecording) stopRecordAudio()
	else startRecordAudio()
}

const stopRecordAudio = () => {
	isRecording = false
	btnRecord.classList.toggle('active')
	unblockChangePath()
	audioPaths[currentRecodingPath].disabled = false
}

const startRecordAudio = () => {
	isRecording = true
	btnRecord.classList.toggle('active')
	blockChangePath()
	currentRecodingPath = Array.from(recordPaths).find(node => node.checked).value
	startRecordTime = Date.now()
}

const blockChangePath = () => {
	recordPaths.forEach(path => (path.disabled = true))
}

const unblockChangePath = () => {
	recordPaths.forEach(path => (path.disabled = false))
}

const playOnePath = pathId => {
	const path = recordedPaths[pathId]
	if (path.length === 0) return

	path.forEach(sound => {
		setTimeout(() => {
			playSound(sound.sound)
		}, sound.startTime)
	})
}

const playSelectedSounds = () => {
	let selected = []
	audioPaths.forEach(path => {
		if (path.checked) selected.push(path.value)
	})
	selected.forEach(path => {
		playOnePath(path)
	})
}

const playAllSounds = () => {
	recordPaths.forEach(path => {
		playOnePath(path.value)
	})
}

document.addEventListener('keypress', onKeyPress)
btnRecord.addEventListener('click', toggleRecording)
btnPlaySelectedSound.addEventListener('click', playSelectedSounds)
btnPlayAllSound.addEventListener('click', playAllSounds)
