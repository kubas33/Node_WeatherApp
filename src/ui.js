const searchForm = document.querySelector('#search-form');

// Nasłuchiwanie zdarzenia 'submit' dla formularza
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const city = formData.get('city');
  console.log(`Miasto: ${city}`);
  try {
    // Wysłanie żądania POST do ścieżki '/submit-form'
    const response = await fetch('/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ city: city })
    });

    // Sprawdzenie poprawności odpowiedzi
    if (!response.ok) {
      throw new Error('Wystąpił błąd podczas wysyłania żądania.');
    }

    // Przetworzenie otrzymanej odpowiedzi do formatu JSON
    const data = await response.json();
    console.log('Odebrana odpowiedź:', data);
    await generateTodayWeather(data);

    // Tutaj możesz przetwarzać otrzymane dane pogodowe

  } catch (error) {
    console.error('Wystąpił błąd:', error);
    // Tutaj możesz obsłużyć błąd lub wyświetlić odpowiednie komunikaty dla użytkownika
  }
});

const generateTodayWeather = async data => {
  const weatherData = data.weatherData;
  const city = data.city;
  const todayWeatherSection = document.querySelector("#today-weather")
  const cityCont = document.createElement("div");
  const weatherDesc = document.createElement("div");
  const {icon, description, temp, tempFeelsLike, windSpeed, humidity, pressure} = weatherData;

  cityCont.classList.add("city-container");
  cityCont.innerHTML = `${city} / Dzisiaj`;
  clearSection(todayWeatherSection);
  todayWeatherSection.appendChild(cityCont);

  weatherDesc.classList.add("weather-desc")
  weatherDesc.appendChild(generateIconWeather(icon));
  weatherDesc.appendChild(generateHTMLElement(description, "p", "weather-desc"));
  weatherDesc.appendChild(generateCurrentTemp(temp, tempFeelsLike))
  const windSpeedPerHour = calculateMetersPerSecondToKilometersPerHour(windSpeed);
  weatherDesc.appendChild(generateWindPressAndHumidity(windSpeedPerHour, pressure, humidity))
  todayWeatherSection.appendChild(weatherDesc);
}

const clearSection = section => {
  section.innerHTML = "";
}

const generateIconWeather = (iconName) => {
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `/icons/${iconName}.png`;
  weatherIcon.alt = "weather icon";
  weatherIcon.classList.add("weather-icon");
  return weatherIcon;
}

const generateHTMLElement = (desc, el, clas = "") => {
  const element = document.createElement(el);
  element.textContent = desc;
  element.classList.add(clas);
  return element;
}

const generateCurrentTemp = (temp, fellTemp) => {
  const tempDescCont = document.createElement("div");
  const currentTemp = document.createElement("p");
  const currentFellTemp = document.createElement("p");
  tempDescCont.appendChild(currentTemp);
  tempDescCont.appendChild(currentFellTemp);
  currentTemp.textContent = `${temp}°C`;
  currentFellTemp.textContent = `Odczuwalna: ${fellTemp}`;
  tempDescCont.classList.add("temp-cont");
  return tempDescCont;
}
const generateWindPressAndHumidity = (wind, pressure, humidity) => {
  const container = generateHTMLElement("", "div", "pressure-cont")
  container.appendChild(generateHTMLElement(`${wind} km/h`, "p", "wind"));
  container.appendChild(generateHTMLElement(`${pressure} kPa`, "p","pressure"));
  container.appendChild(generateHTMLElement(`${humidity} %`,"p", "humidity"));
  return container
}

const calculateMetersPerSecondToKilometersPerHour = speed => {
  return Math.round(speed / 1000 * 3600);
}