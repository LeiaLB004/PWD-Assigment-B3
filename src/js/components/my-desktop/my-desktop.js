/**
 * The desktop web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

import '../my-desktop-dock/index.js'
import '../my-memory-game/index.js'

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

  my-memory-game {
    display: none;
  }

</style>
<div id="desktop-body">
<my-desktop-dock></my-desktop-dock>
<my-memory-game></my-memory-game>
</div>
`

customElements.define('my-desktop',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #dock
    #memoryGame
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#dock = this.shadowRoot.querySelector('my-desktop-dock')
      this.#memoryGame = this.shadowRoot.querySelector('my-memory-game')
    }

    connectedCallback () {
      this.#dock.addEventListener('open-app', this.openApp.bind(this))
    }

    openApp (event) {
      console.log(event)
      const appType = event.detail.appType
      switch (appType) {
        case 'memory':
          this.openMemoryApp()
          console.log('Hej!')
          break
        default:
          console.error('Unknown app type.')
      }
    }


    openMemoryApp () {
      this.#memoryGame.style.display = 'block'
    }
  }
)
