const asyncAdd = async (a, b) => {
	if (typeof a !== 'number' || typeof b !== 'number') {
		return Promise.reject('Argumenty muszą mieć typ number!')
	}
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(a + b)
		}, 100)
	})
}

const add = async (...args) => {
	if (args.length < 1) return

	if (args.length == 1) return args[0]

	let sum = 0
	for (let index = 0; index < args.length; index++) {
		if (typeof args[index] !== 'number') continue
		const number = parseInt(args[index])
		await asyncAdd(sum, number).then(value => {
			sum = value
		})
	}
	return sum
}

const measuerTheTime = async func => {
	const start = performance.now()
	await func.then(() => {
		const stop = performance.now()
		const time = Math.round(stop - start) / 1000
		console.log(`Czas wykonania działania: ${time} sekund`)
	})
}

const func = (async () => {
	const table = Array.from({ length: 100 }, () => Math.floor(Math.random() * 100))
	console.log(`Elementy: ${table}`)
	console.log('Wykonuje obliczenia..')
	const sum = await add(...table)
	console.log(`Suma dodawania: ${sum}`)
})()

const result = measuerTheTime(func)
