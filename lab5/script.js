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

;(async () => {
	console.log(await add(1, 2, 3, 4, 'asd'))
})()
