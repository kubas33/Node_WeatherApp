//weatherData.js

const API_KEY = '80f968c18871ba797f3c5ba8903d0996';

const getWeatherData = async city => {
  const language = 'pl';
  const units = 'metric';

  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}&lang=${language}`, {
    method: 'GET',
  });
  const data = await response.json();
  console.log(`Pogoda: ${JSON.stringify(data)}`);
  //console.log(`Czas: ${(new Date(data.dt * 1000).toString())}`);
  return data;
}

const processWeatherData = async city => {
  data = await getWeatherData(city);
  const result = 
  {
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    temp:Math.round(data.main.temp),
    tempFeelsLike : Math.round(data.main.feels_like),
    pressure: data.main.pressure,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windGust: data.wind.gust, //poryw wiatru (prędkość w porywach, krótkotrwała)
    windDirection: data.wind.deg,
    cloudsPercent: data.clouds.all,
  }
  console.log(result);
  return result;
}

//processWeatherData('Kalisz');

module.exports = {
  processWeatherData,
}