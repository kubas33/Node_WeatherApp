//weatherData.js
const { log } = require('console');
const date_fns = require('../node_modules/date-fns');
const pl = require('../node_modules/date-fns/src/locale/pl');

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


const getWeatherForecast = async city => {
  const language = 'pl';
  const units = 'metric';

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}&lang=${language}`, {
    method: 'GET',
  });
  const data = await response.json();
  for (const day of Object.entries(data.list)) {
    console.log(`${JSON.stringify(day)}\n`);
  }
  //console.log(`Pogoda: ${JSON.stringify(data)}\n\n`);
  return data;
}
//getWeatherForecast("Sydney");
//processWeatherData('Kalisz');


const getWeatherForecastInGivenDay = async (city, givenDay) => {
  const data = await getWeatherForecast(city)
  const now = new Date();
  const afterGivenDays = new Date(now.getTime() + (parseInt(givenDay) * (24 * 60 * 60)) * 1000);
  const dayAfterGivenDays = afterGivenDays.getDate();
  const forecastInGivenDays = data.list.filter(day=> {
    const dt = new Date(day.dt * 1000);
    //console.log(dt.getDate());
    return dt.getDate() === dayAfterGivenDays;
  })
  forecastInGivenDays.forEach(day => {
    console.log(day);
  })

  return forecastInGivenDays;
};

const processWeatherDataInGivenDay = async (city, givenDay) => {
  data = await getWeatherForecastInGivenDay(city, givenDay);
  const tempArr = data.map(day => Math.round(day.main.temp));
  const weatherIconArr = data.map(day => day.weather[0].icon);
  const timeOfDayArr = data.map(day => (new Date(day.dt * 1000)).getUTCHours());
  const day = new Date(data[0].dt * 1000);

  const result = {
    minMaxTemp: minMax(tempArr),
    mostCommonWeatherIcon: mostCommon(weatherIconArr),
    day: date_fns.format(day, 'ddd', {locale: pl}),
    tempArr: tempArr,
    weatherIconArr: weatherIconArr,
    timeOfDayArr
  };
  console.log(result);
};

function minMax(items) {
  let newItems = []
  const isArray = Array.isArray(items)
  const onlyHasNumbers = !items.some(i => isNaN(parseFloat(i)))

  // only proceed if items is a non-empty array of numbers
  if (isArray && items.length > 0 && onlyHasNumbers) {
    newItems = items.reduce((acc, cur) => [
        Math.min(cur, acc[0]),
        Math.max(cur, acc[1])
      ], [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])
  }
  return newItems
}

function mostCommon(items) {
  const hashMap = items.reduce((acc, cur) => {
    console.log(`acc[cur]: ${acc[cur]}`);
    console.log(`cur: ${cur}`);
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  },{})
  return Object.keys(hashMap).reduce((first, sec) => hashMap[first] > hashMap[sec] ? first : sec)
}


processWeatherDataInGivenDay("Kalisz", 2);

module.exports = {
  processWeatherData,
  getWeatherForecastInGivenDay
}