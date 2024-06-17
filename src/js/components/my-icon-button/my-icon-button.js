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
