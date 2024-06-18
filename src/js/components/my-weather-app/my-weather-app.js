/**
 * The weather web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>

</style>
<div id="weather-container">
<p>Väder app</p>
</div>
`

customElements.define('my-weather-app',
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
