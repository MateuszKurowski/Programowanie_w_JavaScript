const apiKey = 'cb263a9ed6988851a2ee09f0fe224e91'
const weatherArray = []

const displayWeather = data => {
	const { name } = data
	if (weatherArray.includes(name.toLowerCase())) {
		alert('This city has already been added!')
		return
	}

	const { icon, description } = data.weather[0]
	const { temp, humidity } = data.main
	const weatherDiv = ` <div id="${name.toLowerCase()}" class="weather loading">
    <h1 class="city">Weather in ${name}</h1>
    <h2 class="temp">${temp} °C </h2>
    <div class="flex">
      <img src="http://openweathermap.org/img/wn/${icon}.png" alt="" class="icon" />
      
      <p class="description">${description}</p>
    </div>
    <p class="humidity">Humidity: ${humidity}% </p>
  </div> `

	if (weatherArray.length > 9) {
		const deleted = weatherArray.shift()
		document.querySelector('#' + deleted).remove()
	}

	document.querySelector('#weathers').innerHTML = weatherDiv + document.querySelector('#weathers').innerHTML

	weatherArray.push(name.toLowerCase())

	localStorage.setItem('weathers', JSON.stringify(weatherArray))
}

const downloadWeatherFromApi = city => {
	fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metric&appid=' + apiKey)
		.then(response => response.json())
		.then(data => displayWeather(data))
}

const getCity = () => {
	const searchBar = document.querySelector('.search-bar').value
	downloadWeatherFromApi(searchBar)
}

document.querySelector('.search button').addEventListener('click', function () {
	getCity()
})

document.querySelector('.search-bar').addEventListener('keyup', function (event) {
	if (event.key == 'Enter') getCity()
})

const weathersSaved = JSON.parse(localStorage.getItem('weathers') || '[]')
weathersSaved.forEach(element => {
	downloadWeatherFromApi(element)
})
