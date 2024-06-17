/**
 * The desktop dock web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  #dock {
    display: block;
    position: fixed;
    background-color: #dfbfd3;
    width: 100%;
    border-radius:0px 0px 8px 8px;
  }
</style>
<div id="dock">
  <p>Dock content</p>
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
