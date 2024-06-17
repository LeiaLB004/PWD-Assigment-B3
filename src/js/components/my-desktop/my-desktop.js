/**
 * The desktop web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
  #desktop-body {
    background-image: url("./js/components/my-desktop/images/background.jpg");
    background-size: cover;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

</style>
<div id="desktop-body">
  <p>Hejsan!</p>
</div>
`

customElements.define('my-desktop',
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
