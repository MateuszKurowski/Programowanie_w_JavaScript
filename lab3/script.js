const btnRecord = document.querySelector('.record')
const overwrite = document.querySelector('.overwrite')
const btnPlaySelectedSound = document.querySelector('.playSelected')
const btnPlayAllSound = document.querySelector('.playAll')
const metronomeSound = document.querySelector('#metronome')
const btnMetronome = document.querySelector('.metronomeSwitch')
const metronomeBeats = document.querySelector('.beatsPerMinute')
const recordPaths = document.querySelector('.recordAudioMenu').querySelectorAll('input')
const audioPaths = document.querySelector('.playAudioMenu').querySelectorAll('input')
const sound = './sound'
let isRecording = false
let isMetronomeOn = false
const recordedPaths = []
let currentRecodingPath = 0
let startRecordTime
let metronomeInterval

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
	if (overwrite.checked) {
		recordedPaths[currentRecodingPath] = []
	}
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

const toggleMetronome = () => {
	if (!isMetronomeOn) {
		console.log('Ustawiono interwał')
		metronomeInterval = setInterval(playMetronome, Math.round(metronomeBeats.value * 1000))
	} else {
		clearInterval(metronomeInterval)
		console.log('Koniec interwału')
	}
	console.log(isMetronomeOn)
	btnMetronome.classList.toggle('active')
	isMetronomeOn = !isMetronomeOn
}

const playMetronome = () => {
	playSound(metronomeSound)
}

const changeMetronomeInterval = () => {
	if (!isMetronomeOn) return
	if (!metronomeInterval) return
	console.log(metronomeBeats.value)
	clearInterval(metronomeInterval)
	metronomeInterval = setInterval(playMetronome, Math.round(metronomeBeats.value * 1000))
}

document.addEventListener('keypress', onKeyPress)
btnRecord.addEventListener('click', toggleRecording)
btnPlaySelectedSound.addEventListener('click', playSelectedSounds)
btnPlayAllSound.addEventListener('click', playAllSounds)
btnMetronome.addEventListener('click', toggleMetronome)
metronomeBeats.addEventListener('change', changeMetronomeInterval)
