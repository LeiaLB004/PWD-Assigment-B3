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
    height: 80px;
    border-bottom: 2px solid white;
    color: white;
    border-radius: 0px 0px 10px 10px;
  }

  my-icon-button {
    padding-right: 30px;
    float: right;
    padding-top: 10px;
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

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.addEventListener('icon-click', this.handleIconClick)
    }

    /**
     * Called when disconnected from the DOM.
     */
    disconnectedCallback () {
      this.removeEventListener('icon-click', this.handleIconClick)
    }

    /**
     * Handles the click event on the icon button.
     *
     * @param {Event} event The click event triggered by the icon button.
     */
    handleIconClick (event) {
      const appType = event.detail.appType
      this.dispatchEvent(new CustomEvent('open-app', {
        detail: { appType },
        bubbles: true,
        composed: true
      }))
    }
  }
)
