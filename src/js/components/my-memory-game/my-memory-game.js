/**
 * The my-memory-game web component module.
 *
 * @author Mats Loock <mats.loock@lnu.se>
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.1.0
 */

import '../my-flipping-tile/index.js'
import '../my-game-timer/index.js'

/*
 * Get image URLs.
 */
const NUMBER_OF_IMAGES = 9

const IMG_URLS = new Array(NUMBER_OF_IMAGES)
for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
  IMG_URLS[i] = `./js/components/my-memory-game/images/${i}.png`
  console.log(`Image URL ${i}: ${IMG_URLS[i]}`)
}

/*
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host {
      --tile-size: 80px;
      --button-bg-color: #6e5483;
      --button-hover-bg-color: #563d62;
      --button-active-bg-color: #452d4a;
      --button-text-color: #ffffff;
      --button-border-radius: 5px;
      --button-padding: 10px 20px;
      --text-color: #333;
      --font-family: Arial, sans-serif;
      --counter-font-size: 1.2em;
    }
    #game-board {
      display: grid;
      grid-template-columns: repeat(4, var(--tile-size));
      gap: 20px;
      margin-bottom: 20px;
      justify-content:center;
    }
    #game-board.small {
      display: flex;
      justify-content: center;
      grid-template-columns: repeat(2, var(--tile-size));
    }
    my-flipping-tile {
      width: var(--tile-size);
      height: var(--tile-size);
    }
    my-flipping-tile:focus {
      outline: 2px solid #6e5483;
    }
    my-flipping-tile::part(tile-back) {
      border-width: 5px;
      background: url("${IMG_URLS[0]}") no-repeat center/80%, radial-gradient(#fff, #6e5483);
    }
    #board-size-select {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    #board-size-select button {
      background-color: var(--button-bg-color);
      color: var(--button-text-color);
      border: none;
      border-radius: var(--button-border-radius);
      padding: var(--button-padding);
      cursor: pointer;
      font-family: var(--font-family);
    }
    #board-size-select button:hover {
      background-color: var(--button-hover-bg-color);
    }
    #board-size-select button:active {
      background-color: var(--button-active-bg-color);
    }

    #attempt-counter {
      color: var(--text-color);
      font-family: var(--font-family);
      font-size: var(--counter-font-size);
      margin-bottom: 20px;
      text-align: center;
    }

    #retry-button {
      display: none;
      background-color: var(--button-bg-color);
      color: var(--button-text-color);
      border: none;
      border-radius: var(--button-border-radius);
      padding: var(--button-padding);
      cursor: pointer;
      font-family: var(--font-family);
      margin-top: 20px;
      margin: 0 auto;
    }
    #retry-button:hover {
      background-color: var(--button-hover-bg-color);
    }
    #retry-button:active {
      background-color: var(--button-active-bg-color);
    }

    my-game-timer {
      text-align: center;
      padding-bottom: 30px;
    }
  </style>
  <my-game-timer></my-game-timer>
  <template id="tile-template">
    <my-flipping-tile>
      <img />
    </my-flipping-tile>
  </template>
  <div id="game-board">
  </div>
  <div id="board-size-select">
      <button value="large">4x4</button>
      <button value="medium">4x2</button>
      <button value="small">2x2</button>
  </div>
  <div id="attempt-counter">Attempts: 0</div>
  <button id="retry-button">Retry</button>
`

/*
 * Define custom element.
 */
customElements.define('my-memory-game',
  /**
   * Represents a memory game
   */
  class extends HTMLElement {
    #retryButton
    #attemptCounter
    #attempts = 0
    #gameTimer
    #firstClick = true
    /**
     * The game board element.
     *
     * @type {HTMLDivElement}
     */
    #gameBoard

    /**
     * The tile template element.
     *
     * @type {HTMLTemplateElement}
     */
    #tileTemplate

    #boardSizeSelect

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the game board element in the shadow root.
      this.#gameBoard = this.shadowRoot.querySelector('#game-board')

      // Get the tile template element in the shadow root.
      this.#tileTemplate = this.shadowRoot.querySelector('#tile-template')
      this.#attemptCounter = this.shadowRoot.querySelector('#attempt-counter')
      this.#retryButton = this.shadowRoot.querySelector('#retry-button')
      this.#gameTimer = this.shadowRoot.querySelector('my-game-timer')
      this.#boardSizeSelect = this.shadowRoot.querySelector('#board-size-select')

      this.#boardSizeSelect.addEventListener('click', (event) => {
        this.boardSize = event.target.value
        this.#gameTimer.resetTime()
        this.#attempts = 0
        this.#updateAttemptCounter()
        this.#firstClick = true
      })

      this.#retryButton.addEventListener('click', () => {
        this.#firstClick = true
        this.#boardSizeSelect.style.display = 'flex'
        this.#retryButton.style.display = 'none'
        // Reset attempts counter and update UI
        this.#attempts = 0
        this.#updateAttemptCounter()

        this.#tiles.all.forEach((tile, i) => {
          tile.removeAttribute('face-up')
          tile.removeAttribute('hidden')
          tile.removeAttribute('disabled')
        })
        this.#gameTimer.resetTime()
        setTimeout(() => {
          this.#init()
        }, 500)
      })
    }

    /**
     * Gets the board size.
     *
     * @returns {string} The size of the game board.
     */
    get boardSize () {
      return this.getAttribute('boardsize')
    }

    /**
     * Sets the board size.
     *
     * @param {string} value - The size of the game board.
     */
    set boardSize (value) {
      this.setAttribute('boardsize', value)
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['boardsize']
    }

    /**
     * Get the game board size dimensions.
     *
     * @returns {object} The width and height of the game board.
     */
    get #gameBoardSize () {
      const gameBoardSize = {
        width: 4,
        height: 4
      }

      switch (this.boardSize) {
        case 'small': {
          gameBoardSize.width = gameBoardSize.height = 2
          break
        }

        case 'medium': {
          gameBoardSize.height = 2
          break
        }
      }

      return gameBoardSize
    }

    /**
     * Get all tiles.
     *
     * @returns {object} An object containing grouped tiles.
     */
    get #tiles () {
      const tiles = Array.from(this.#gameBoard.children)
      return {
        all: tiles,
        faceUp: tiles.filter(tile => tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        faceDown: tiles.filter(tile => !tile.hasAttribute('face-up') && !tile.hasAttribute('hidden')),
        hidden: tiles.filter(tile => tile.hasAttribute('hidden'))
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('boardsize')) {
        this.setAttribute('boardsize', 'large')
      }

      this.#upgradeProperty('boardsize')

      // Set focus on the first tile
      const firstTile = this.#tiles.all[0]
      if (firstTile) {
        firstTile.setAttribute('tabindex', '0')
        firstTile.focus()
      }

      // Listen after flipping of tile
      this.#gameBoard.addEventListener('my-flipping-tile:flip', () => {
        // If the flipping is the first one of the game,
        // start a timer and set firstClick to false
        if (this.#firstClick) {
          this.#gameTimer.startTimer()
          this.#firstClick = false
        }
        this.#onTileFlip()
      })

      this.addEventListener('dragstart', (event) => {
        // Disable element dragging.
        event.preventDefault()
        event.stopPropagation()
      })

      // Listen for pressed keys
      this.addEventListener('keydown', (event) => {
        console.log('You pressed down', event.key)
        // If key with arrow, move the focus for that key
        if (event.key.startsWith('Arrow')) {
          event.preventDefault()
          this.#moveFocus(event.key)
        // If the pressed key is "Enter", flip the focused tile
        } else if (event.key === 'Enter') {
          event.preventDefault()
          this.#flipFocusedTile()
        }
      })
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'boardsize') {
        this.#init()
      }
    }

    /**
     * Run the specified instance property through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Initializes the game board size and tiles.
     */
    #init () {
      const { width, height } = this.#gameBoardSize

      const tilesCount = width * height

      if (tilesCount !== this.#tiles.all.length) {
        // Remove existing tiles, if any.
        while (this.#gameBoard.firstChild) {
          this.#gameBoard.removeChild(this.#gameBoard.lastChild)
        }

        if (width === 2) {
          this.#gameBoard.classList.add('small')
        } else {
          this.#gameBoard.classList.remove('small')
        }

        // Add tiles.
        for (let i = 0; i < tilesCount; i++) {
          const tile = this.#tileTemplate.content.cloneNode(true)
          this.#gameBoard.appendChild(tile)
        }
      }

      // Create a sequence of numbers between 0 and 15,
      // and then shuffle the sequence.
      const indexes = [...Array(tilesCount).keys()]

      for (let i = indexes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexes[i], indexes[j]] = [indexes[j], indexes[i]]
      }

      // Set the tiles' images.
      this.#tiles.all.forEach((tile, i) => {
        tile.querySelector('img').setAttribute('src', IMG_URLS[indexes[i] % (tilesCount / 2) + 1])
        tile.faceUp = tile.disabled = tile.hidden = false
      })

      this.#tiles.all.forEach(tile => {
        tile.setAttribute('tabindex', '0')
      })
    }

    /**
     * Handles flip events.
     */
    #onTileFlip () {
      const tiles = this.#tiles
      const tilesToDisable = Array.from(tiles.faceUp)

      if (tiles.faceUp.length > 1) {
        tilesToDisable.push(...tiles.faceDown)
      }

      tilesToDisable.forEach(tile => (tile.setAttribute('disabled', '')))

      const [first, second, ...tilesToEnable] = tilesToDisable

      if (second) {
        // If two tiles are flipped, increase the number of attempts
        this.#attempts++ // Increment attempts counter
        // Update the attempt counter
        this.#updateAttemptCounter()

        // Compare the tiles to check if equal
        const isEqual = first.isEqual(second)
        const delay = isEqual ? 1000 : 1500
        window.setTimeout(() => {
          let eventName = 'memory-game:tiles-mismatch'
          if (isEqual) {
            first.setAttribute('hidden', '')
            second.setAttribute('hidden', '')
            eventName = 'memory-game:tiles-match'
            // Foucus back on the first chosen tile
            first.focus()
          } else {
            first.removeAttribute('face-up')
            second.removeAttribute('face-up')
            tilesToEnable.push(first, second)
          }

          this.dispatchEvent(new CustomEvent(eventName, {
            bubbles: true,
            detail: { first, second }
          }))

          // Check if all tiles are hidden
          // If so disable them all, end the game and show the results
          if (tiles.all.every(tile => tile.hidden)) {
            tiles.all.forEach(tile => (tile.disabled = true))
            this.dispatchEvent(new CustomEvent('memory-game:game-over', {
              bubbles: true
            }))

            this.#boardSizeSelect.style.display = 'none'
            this.#retryButton.style.display = 'block'

            this.#attemptCounter.textContent = `Game Over! Total Attempts: ${this.#attempts}`
            this.#gameTimer.stopTimer()
            this.#init()
          } else {
            tilesToEnable?.forEach(tile => (tile.removeAttribute('disabled')))
          }
        }, delay)
      }
    }

    /**
     * Move the focus to the next tile.
     *
     * @param {string} key - The key names.
     */
    #moveFocus (key) {
      const tiles = this.#tiles.all
      const focusedIndex = tiles.findIndex(tile => tile === this.shadowRoot.activeElement)

      if (focusedIndex !== -1) {
        let nextIndex
        switch (key) {
          case 'ArrowUp':
            nextIndex = focusedIndex - this.#gameBoardSize.width
            break
          case 'ArrowDown':
            nextIndex = focusedIndex + this.#gameBoardSize.width
            break
          case 'ArrowLeft':
            nextIndex = focusedIndex - 1
            break
          case 'ArrowRight':
            nextIndex = focusedIndex + 1
            break
          default:
            return
        }

        // Double check if index are inside the board.
        if (nextIndex >= 0 && nextIndex < tiles.length) {
          tiles[nextIndex].focus() // Move foucus to the next tile.
        }
      }
    }

    /**
     * Flip the focused tile.
     */
    #flipFocusedTile () {
      const focusedTile = this.shadowRoot.querySelector(':focus')
      console.log(focusedTile, focusedTile.tagName)

      if (focusedTile && focusedTile.tagName === 'MY-FLIPPING-TILE') {
        focusedTile.click() // Simulate clicking.
        focusedTile.focus()
      }
    }

    /**
     * Updates the attempt counter in the UI.
     */
    #updateAttemptCounter () {
      this.#attemptCounter.textContent = `Attempts: ${this.#attempts}`
    }
  }
)
