const express = require('./node_modules/express');
const bodyParser = require('./node_modules/body-parser');
const { processWeatherData } = require('./src/weatherData');

const app = express();
const port = 5500;

app.use(express.static('src'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Dodajemy obsługę przetwarzania danych formularza
app.use(express.json()); // Dodajemy obsługę przetwarzania danych JSON

// Obsługa żądania GET dla ścieżki głównej
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Obsługa żądania POST dla ścieżki '/submit-form'
app.post('/submit-form', async (req, res) => {
  console.log(req.body);
  const city = req.body.city;

  try {
    // Wywołanie funkcji processWeatherData z pliku weatherData.js
    console.log("Trying to get data")
    const weatherData = await processWeatherData(city);

    // Utworzenie odpowiedzi JSON z danymi pogodowymi
    const response = {
      message: 'Dane zostały odebrane pomyślnie!',
      city: city,
      weatherData: weatherData
    };

    res.json(response);
  } catch (error) {
    // Utworzenie odpowiedzi JSON w przypadku błędu
    const response = {
      message: 'Wystąpił błąd podczas przetwarzania danych!',
      error: error.message
    };

    res.status(500).json(response);
  }
});

app.get('*', (req, res) => {
  res.redirect('/');
});


// Uruchomienie serwera nasłuchującego na zdefiniowanym porcie
app.listen(port, () => {
  console.log(`Serwer Express nasłuchuje na porcie ${port}`);
});
