const btnAddNote = document.querySelector('.btnNewNote')
const btnClearNotes = document.querySelector('.clearNotes')
const content = document.querySelector('.content')
const template = document.querySelector('.template')
const templatePopup = document.querySelector('.templatePopup')
const btnClosePopup = document.querySelector('.closePopup')
let btnDelete = document.querySelectorAll('.delete')
let btnEdit = document.querySelectorAll('.edit')
let noteArray = []

const compareNotes = (a, b) => {
	if (a.pin && !b.pin) return -1
	if (!a.pin && b.pin) return 1
	console.log('nie pin')

	if (a.aDate < b.aDate) {
		return -1
	}
	if (a.aDate > b.aDate) {
		return 1
	}
	return 0
}

const deleteNote = e => {
	const note = e.target.parentNode.parentNode.parentNode
	if (!note) return
	const noteId = note.querySelector('.noteId').textContent
	const newArray = noteArray.filter(function (x) {
		return x.id != noteId
	})
	noteArray = newArray
	SaveNotes()
	LoadNotes()
}

const closePopup = () => {
	const noteNode = document.querySelector('.popupNote')
	const noteId = noteNode.querySelector('.noteId').textContent
	const note = noteArray.find(x => x.id == noteId)
	const editedNote = templatePopup.querySelector('.popupNote')
	note.pin = editedNote.querySelector('.notePin').checked
	note.aDate = editedNote.querySelector('.noteDate').value
	note.title = editedNote.querySelector('.noteTitle').value
	note.content = editedNote.querySelector('.noteContent').value
	note.color = editedNote.querySelector('.noteColor').value
	SaveNotes()
	LoadNotes()
	templatePopup.classList.add('templatePopup')
}

const showPopup = e => {
	const noteObject = e.target.parentNode.parentNode.parentNode
	const noteId = noteObject.querySelector('.noteId').textContent
	const note = noteArray.find(x => x.id == noteId)
	if (!note) return
	templatePopup.classList.remove('templatePopup')
	const editedNote = templatePopup.querySelector('.popupNote')
	editedNote.querySelector('.noteId').textContent = note.id
	editedNote.querySelector('.notePin').checked = note.pin
	editedNote.querySelector('.noteDate').value = new Date(note.aDate).toLocaleString('en-US')
	editedNote.querySelector('.noteTitle').value = note.title
	editedNote.querySelector('.noteContent').value = note.content
	editedNote.querySelector('.noteColor').value = note.color
}

const LoadNotes = () => {
	const notesFromStorage = localStorage.getItem('Notes')
	while (content.firstChild) {
		content.removeChild(content.lastChild)
	}
	if (!notesFromStorage) return
	noteArray = JSON.parse(notesFromStorage)
	noteArray.sort(compareNotes)
	if (!noteArray) noteArray = []
	noteArray.forEach(note => {
		const newNote = template.cloneNode(true)
		newNote.querySelector('.noteId').textContent = note.id
		newNote.querySelector('.notePin').checked = note.pin
		newNote.querySelector('.noteDate').textContent = 'Date: ' + new Date(note.aDate).toLocaleString('en-US')
		newNote.querySelector('.noteTitle').textContent = 'Title: ' + note.title
		newNote.querySelector('.noteContent').textContent = note.content
		newNote.style.backgroundColor = note.color
		newNote.classList.remove('template')
		content.appendChild(newNote)
	})
	btnDelete = document.querySelectorAll('.delete')
	btnEdit = document.querySelectorAll('.edit')
	btnEdit.forEach(x => x.addEventListener('click', showPopup))
	btnDelete.forEach(x => x.addEventListener('click', deleteNote))
}
LoadNotes()

const SaveNotes = () => {
	localStorage.setItem('Notes', JSON.stringify(noteArray))
}

const AddNote = () => {
	const temp = document.querySelectorAll('.newNote .formInputs')

	const newNote = {
		id: Date.now(),
		title: temp[0].value,
		content: temp[1].value,
		color: temp[2].value,
		pin: temp[3].checked,
		aDate: new Date().toISOString(),
	}
	noteArray.push(newNote)
	SaveNotes()
	LoadNotes()
}

const ClearNotes = () => {
	localStorage.clear()
	noteArray = []
	LoadNotes()
}

btnAddNote.addEventListener('click', AddNote)
btnClearNotes.addEventListener('click', ClearNotes)
btnDelete.forEach(x => x.addEventListener('click', deleteNote))
btnEdit.forEach(x => x.addEventListener('click', showPopup))
btnClosePopup.addEventListener('click', closePopup)
