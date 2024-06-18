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
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
  }

  input[type="text"] {
    width: calc(100% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
  }

  button:hover {
    background-color: #0056b3;
  }

  .weather-info {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
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
        <p><strong>Temperature:</strong> ${temperature} °C</p>
        <p><strong>Description:</strong> ${description}</p>
      `
    }
  }
)
