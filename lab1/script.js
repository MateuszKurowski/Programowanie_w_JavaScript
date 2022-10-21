// Wersja shame
let form = document.getElementById('formNumbers')
let values = document.getElementsByClassName('form')
let removeFieldsButtons = document.getElementsByClassName('deleteField')
const calculateButton = document.querySelector('.calculate')
const addFieldsButtons = document.querySelector('.addField')
const sum = document.querySelector('#sum')
const avg = document.querySelector('#avg')
const min = document.querySelector('#min')
const max = document.querySelector('#max')

const calculate = () => {
	let sumValue = null
	for (const value of values) {
		sumValue += parseInt(value.value)
	}
	if (!sumValue && sumValue !== 0) {
		sum.textContent = ''
		avg.textContent = ''
		min.textContent = ''
		max.textContent = ''
		return
	}
	sum.textContent = sumValue

	avg.textContent = (sumValue / values.length).toFixed(2)

	const array = []
	for (const value of values) {
		array.push(value.value)
	}
	min.textContent = Math.min(...array)
	max.textContent = Math.max(...array)
}

const addField = () => {
	console.log('test')
	const newDiv = document.createElement('div')
	newDiv.classList.add('formDiv')

	const newField = document.createElement('input')
	newField.type = 'number'
	newField.classList.add('form')

	const newSpan = document.createElement('span')
	newSpan.classList.add('deleteField')
	newSpan.textContent = '➖'

	form.append(newDiv)
	newDiv.append(newField)
	newDiv.append(newSpan)
	reloadFields()
	calculate()
}

const removeField = e => {
	e.target.parentElement.remove()
	reloadFields()
	calculate()
}

const reloadFields = () => {
	listenAddButtons()
	listenRemoveButtons()
}

const listenAddButtons = () => {
	for (const button of values) {
		button.addEventListener('change', calculate)
		button.addEventListener('keyup', calculate)
	}
}

const listenRemoveButtons = () => {
	for (const removeButton of removeFieldsButtons) {
		removeButton.addEventListener('click', removeField)
	}
}

calculateButton.addEventListener('click', calculate)

//Wersja zieew
listenAddButtons()

//Wersja normal
listenRemoveButtons()
addFieldsButtons.addEventListener('click', addField)
