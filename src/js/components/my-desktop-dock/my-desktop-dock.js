/**
 * The desktop dock web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

import '../my-icon-button/index.js'

const template = document.createElement('template')
template.innerHTML = `
<style>
  #dock {
    display: block;
    position: fixed;
    background-color: #6e5483;
    width: 100%;
    border-bottom: 2px solid white;
    color: white;
    border-radius: 0px 0px 10px 10px;
  }

  my-icon-button {
    padding-right: 20px;
    float: right;
  }
</style>
<div id="dock">
  <my-icon-button app-type="memory" src="./js/components/my-desktop-dock/images/memory-icon.png"></my-icon-button>
  <my-icon-button app-type="weather" src="./js/components/my-desktop-dock/images/weather-icon.png"></my-icon-button>
  <my-icon-button app-type="messages" src="./js/components/my-desktop-dock/images/chat-icon.png"></my-icon-button>
</div>
`

customElements.define('my-desktop-dock',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }
)
