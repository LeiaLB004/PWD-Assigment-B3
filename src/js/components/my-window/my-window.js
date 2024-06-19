/**
 * The window web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
:host {
    display: block;
    position: fixed;
    top: 50%; /* Centrera vertikalt */
    left: 50%; /* Centrera horisontellt */
    transform: translate(-50%, -50%);
    width: 800px;
    height: 650px;
    border-radius: 10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
    background-color: white;
    z-index: 1;
  }

  .window-header {
    border-radius: 10px 10px 0 0;
    background-color: #6e5483;
    color: white;
    padding: 10px;
    cursor: move;
    display: flex;
    justify-content: space-between;
  }

  .close-button {
    font-weight: bold;
    border-radius: 3px;
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
  }

  .close-button:hover {
    background-color: white;
    color: #6e5483;
  }

  .window-content {
    padding: 10px;
    height: calc(100% - 40px); /* Adjust based on header height */
    overflow: auto;
    margin: 0 auto;
  }
  emoji-picker {
    --num-columns: 6;
    --category-emoji-size: 1.125rem;
  }
</style>
<div class="window-header">
  <span class="window-title"></span>
  <button class="close-button">x</button>
</div>
<div class="window-content">
  <slot></slot>
</div>
`

customElements.define('my-window',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #dragging = false
    #startX
    #startY
    #title
    #header
    #closeButton

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))

      this.#title = this.shadowRoot.querySelector('.window-title')
      this.#header = this.shadowRoot.querySelector('.window-header')
      this.#closeButton = this.shadowRoot.querySelector('.close-button')
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      this.#title.innerText = this.getAttribute('title')
      this.#closeButton.addEventListener('click', this.closeWindow.bind(this))
      this.#header.addEventListener('mousedown', this.startDrag.bind(this))
      this.addEventListener('mousedown', this.bringToFront.bind(this))
      this.shadowRoot.addEventListener('mousemove', this.drag.bind(this))
      this.shadowRoot.addEventListener('mouseup', this.stopDrag.bind(this))
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    disconnectedCallback () {
      this.#closeButton.removeEventListener('click', this.closeWindow.bind(this))
      this.#header.removeEventListener('mousedown', this.startDrag.bind(this))
      this.removeEventListener('mousedown', this.bringToFront.bind(this))
      this.shadowRoot.removeEventListener('mousemove', this.drag.bind(this))
      this.shadowRoot.removeEventListener('mouseup', this.stopDrag.bind(this))
    }

    /**
     * Starts dragging the window when the mouse is pressed on the header.
     *
     * @param {MouseEvent} event - The mousedown event object.
     */
    startDrag (event) {
      this.#dragging = true
      this.#startX = event.clientX - this.offsetLeft
      this.#startY = event.clientY - this.offsetTop
    }

    /**
     * Drags the window while the mouse is moved, if dragging is active.
     *
     * @param {MouseEvent} event - The mousemove event object.
     */
    drag (event) {
      if (this.#dragging) {
        const x = event.clientX - this.#startX
        const y = event.clientY - this.#startY
        this.style.left = `${x}px`
        this.style.top = `${y}px`
      }
    }

    /**
     * Stops dragging the window when the mouse button is released.
     */
    stopDrag () {
      this.#dragging = false
    }

    /**
     * Bringing the window to the front.
     */
    bringToFront () {
      this.style.zIndex = this.style.zIndex + 1
    }

    /**
     * Method for closing the window.
     */
    closeWindow () {
      this.remove()
    }
  }
)
