const apiKey = 'cb263a9ed6988851a2ee09f0fe224e91'
const weatherArray = []

const displayWeather = data => {
	const { name } = data

	weatherArray.push(name.toLowerCase())

	localStorage.setItem('weathers', JSON.stringify(weatherArray))
}

const downloadWeatherFromApi = city => {
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey)
		.then(response => response.json())
		.then(data => displayWeather(data))
}
