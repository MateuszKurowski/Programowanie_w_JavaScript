// Wersja shame
const btn = document.querySelector('button')
const sum = document.querySelector('#sum')
const avg = document.querySelector('#avg')
const min = document.querySelector('#min')
const max = document.querySelector('#max')
const values = document.querySelectorAll('.form')

const calculate = () => {
	let sumValue = 0
	values.forEach(el => (sumValue += parseInt(el.value)))
	sum.textContent = sumValue

	let avg = sumValue / values.length
	document.getElementById('avg').innerHTML = avg

	const array = []
	for (const value of values) {
		array.push(value.value)
	}
	console.log(array)
	min.textContent = Math.min(...array)
	max.textContent = Math.max(...array)
}

btn.addEventListener('click', calculate)
