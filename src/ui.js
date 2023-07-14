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
    generateTodayWeather(data);

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
  
  cityCont.classList.add("city-container");
  cityCont.innerHTML = `${city} / Dzisiaj`;
  todayWeatherSection.appendChild(cityCont);

  weatherDesc.classList.add("weather-descr")
  weatherDesc.appendChild(generateIconWeather(weatherData.icon));
  weatherDesc.appendChild(generateWeatherDescr(weatherData.description));
  todayWeatherSection.appendChild(weatherDesc);


}

const generateIconWeather = (iconName) => {
  const weatherIcon = document.createElement("img");
  weatherIcon.src = `/icons/${iconName}.png`;
  weatherIcon.alt = "weather icon";
  weatherIcon.classList.add("weather-icon");
  return weatherIcon;
}

const generateWeatherDescr = desc => {
  const weatherDesc = document.createElement("span");
  weatherDesc.textContent = desc;
  return weatherDesc;
}