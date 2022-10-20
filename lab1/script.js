// Wersja shame
const btn = document.querySelector('button')
const sum = document.querySelector('#sum')
const avg = document.querySelector('#avg')
const min = document.querySelector('#min')
const max = document.querySelector('#max')
const values = document.querySelectorAll('.form')

const calculate = () => {
	let sumValue = null
	values.forEach(el => (sumValue += parseInt(el.value)))
	if (!sumValue && sumValue !== 0) {
		sum.textContent = ''
		avg.textContent = ''
		min.textContent = ''
		max.textContent = ''
		return
	}
	sum.textContent = sumValue

	avg.textContent = sumValue / values.length

	const array = []
	for (const value of values) {
		array.push(value.value)
	}
	min.textContent = Math.min(...array)
	max.textContent = Math.max(...array)
}

btn.addEventListener('click', calculate)

//Wersja zieew
values.forEach(val => val.addEventListener('change', calculate))
values.forEach(val => val.addEventListener('keyup', calculate))
