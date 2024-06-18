/**
 * The game timer web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
</style>
<div id="game-time">00:00</div>
`

customElements.define('my-game-timer',
  /**
   * Represents a desktop element.
   */
  class extends HTMLElement {
    #gameStartTime
    #gameTimerInterval
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
    }

    /**
     * Start the game timer.
     */
    startTimer () {
      this.#gameStartTime = Date.now()

      this.#gameTimerInterval = setInterval(() => {
        const elapsedTime = Date.now() - this.#gameStartTime
        const formattedTime = this.#formatTime(elapsedTime)
        this.shadowRoot.querySelector('#game-time').textContent = `${formattedTime}`
      }, 1000)
    }

    /**
     * Stop the game timer.
     */
    stopTimer () {
      clearInterval(this.#gameTimerInterval)
    }

    /**
     * Format the time into MM:SS format.
     *
     * @param {number} elapsedTime - Elapsed time in milliseconds.
     * @returns {string} Formatted time string.
     */
    #formatTime (elapsedTime) {
      const totalSeconds = Math.floor(elapsedTime / 1000)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const formattedMinutes = minutes.toString().padStart(2, '0')
      const formattedSeconds = seconds.toString().padStart(2, '0')
      return `${formattedMinutes}:${formattedSeconds}`
    }
  }
)
