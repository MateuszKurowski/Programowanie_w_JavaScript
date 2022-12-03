const btnAddNote = document.querySelector('.newNote')
const btnClearNotes = document.querySelector('.clearNotes')
const noteArray = []

const LoadNotes = () => {
	const notesFromStorage = localStorage.getItem('Notes')
	if (notesFromStorage) return
	noteArray = JSON.parse(notesFromStorage)
}
LoadNotes()

const SaveNotes = () => {
	localStorage.setItem('Notes', JSON.stringify(noteArray))
}

const AddNote = () => {
	const temp = document.querySelectorAll('.temp input')

	const newNote = {
		id: Date.now(),
		title: temp[0].value,
		content: temp[1].value,
		color: temp[2].value,
		pin: temp[3].checked,
		aDate: new Date(),
	}
	console.log(newNote)
	noteArray.push(newNote)
	SaveNotes()
}

const EditNote = lookingId => {
    const note = noteArray.find(x => x.id == lookingId)
}

const ClearNotes = () => {
	localStorage.clear()
}

btnAddNote.addEventListener('click', AddNote)
btnClearNotes.addEventListener('click', ClearNotes)
