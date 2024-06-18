/**
 * The desktop web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

import '../my-desktop-dock/index.js'
import '../my-memory-game/index.js'
import '../my-chat-app/index.js'
import '../my-weather-app/index.js'
import '../my-window/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  #desktop-body {
    background-image: url("./js/components/my-desktop/images/wallpaper.jpg");
    background-size: cover;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

</style>
<div id="desktop-body">
<my-desktop-dock></my-desktop-dock>
</div>
`

customElements.define('my-desktop',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #dock
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#dock = this.shadowRoot.querySelector('my-desktop-dock')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#dock.addEventListener('open-app', this.openApp.bind(this))
    }

    /**
     * Handles the 'open-app' event to determine which application type to open.
     *
     * @param {CustomEvent} event - The custom event containing the appType in the detail.
     */
    openApp (event) {
      console.log(event)
      const appType = event.detail.appType
      switch (appType) {
        case 'memory':
          this.openMemoryApp()
          console.log('Hej!')
          break
        case 'messages':
          this.openMessageApp()
          break
        case 'weather':
          this.openWeatherApp()
          break
        default:
          console.error('Unknown app type.')
      }
    }

    /**
     * Opens the memory game application by displaying it on the desktop.
     */
    openMemoryApp () {
      const windowElement = document.createElement('my-window')
      windowElement.setAttribute('title', 'Memory Game')
      const memoryGame = document.createElement('my-memory-game')
      windowElement.appendChild(memoryGame)
      this.shadowRoot.querySelector('#desktop-body').appendChild(windowElement)
    }

    /**
     * Opens the chat application by displaying it on the desktop.
     */
    openMessageApp () {
      const windowElement = document.createElement('my-window')
      windowElement.setAttribute('title', 'Message App')
      const messageApp = document.createElement('my-chat-app')
      windowElement.appendChild(messageApp)
      this.shadowRoot.querySelector('#desktop-body').appendChild(windowElement)
    }

    /**
     * Opens the memory game application by displaying it on the desktop.
     */
    openWeatherApp () {
      const windowElement = document.createElement('my-window')
      windowElement.setAttribute('title', 'Weather App')
      const weatherApp = document.createElement('my-weather-app')
      windowElement.appendChild(weatherApp)
      this.shadowRoot.querySelector('#desktop-body').appendChild(windowElement)
    }
  }
)
