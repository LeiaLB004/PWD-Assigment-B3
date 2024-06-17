/**
 * The icon button web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  #icon-button {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
</style>
<img id="icon-button"/>
`

customElements.define('my-icon-button',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #iconButton
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#iconButton = this.shadowRoot.querySelector('#icon-button')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#iconButton.src = this.getAttribute('src')
      this.#iconButton.alt = this.getAttribute('alt')
      this.#iconButton.addEventListener('click', () => this.handleClick())
    }

    /**
     * Handles the click on icon.
     */
    handleClick () {
      const appType = this.getAttribute('app-type')
      this.dispatchEvent(new CustomEvent('icon-click', {
        detail: { appType }
      }))
    }
  }
)
