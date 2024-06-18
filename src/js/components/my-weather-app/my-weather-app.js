/**
 * The weather web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
    .weather-container {
    width: 80%;
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  input[type="text"] {
    width: calc(100% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    box-sizing: border-box;
  }

  button {
    width: 100%;
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #6e5483;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 0 auto;
    text-align: center;
  }

  button:hover {
    background-color: #9a82af;
  }

  .weather-info {
    display: none;
    width: 400px;
    margin: 0 auto;
    margin-top: 50px;
    padding: 20px;
    background-color: #fff;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-family: 'Arial', sans-serif;
    color: #333;
    line-height: 1.6;
  }

  .weather-info h3 {
    color: #6e5483;
    font-size: 24px;
    margin-bottom: 10px;
  }

  .weather-info p {
    font-size: 16px;
    margin-bottom: 8px;
  }

  .weather-info strong {
    font-weight: bold;
    color: #555;
  }
  .weather-info img {
    width: 100px;
    margin-top: 10px;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>
<div id="weather-container">
  <input type="text" id="city-input" placeholder="Enter city">
  <button id="get-weather-button">Get Weather</button>
  <div class="weather-info" id="weather-info"></div>
</div>
`

customElements.define('my-weather-app',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #cityInput
    #weatherInfo
    #getWeatherButton
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#cityInput = this.shadowRoot.querySelector('#city-input')
      this.#weatherInfo = this.shadowRoot.querySelector('#weather-info')
      this.#getWeatherButton = this.shadowRoot.querySelector('#get-weather-button')

      this.#getWeatherButton.addEventListener('click', () => this.getWeather())
    }

    /**
     * Getting the weather from api.
     */
    async getWeather () {
      const cityName = this.#cityInput.value
      if (cityName) {
        const apiKey = import.meta.env.VITE_WEATHER_APP_API_KEY
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`

        try {
          const res = await fetch(apiURL)
          if (!res.ok) {
            throw new Error('Weather data not found')
          }
          this.#weatherInfo.style.display = 'block'
          const data = await res.json()
          this.displayWeather(data)
        } catch (error) {
          console.error('Error fetching weather data:', error)
          this.#weatherInfo.textContent = 'Not a valid city'
        }
      } else {
        this.#weatherInfo.textContent = 'Please enter a city name.'
      }
    }

    /**
     * Displays weather information in the component.
     *
     * @param {object} data - Weather data object received from the API.
     */
    displayWeather (data) {
      const { name, main, weather } = data
      const temperature = main.temp
      const description = weather[0].description
      const icon = weather[0].icon
      const iconurl = `http://openweathermap.org/img/w/${icon}.png`

      this.#weatherInfo.innerHTML = `
      <h3>Weather in ${name}</h3>
        <img src=${iconurl} alt="Weather icon"/>
        <p><strong>Temperature</strong> <br/>${temperature} °C</p>
        <p><strong>Description</strong> <br/>${description}</p>
      `
    }
  }
)
