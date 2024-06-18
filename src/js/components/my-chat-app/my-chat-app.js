/**
 * The chat app web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

const template = document.createElement('template')
template.innerHTML = `
<style>
#chat-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

#messages {
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

textarea, input[type="text"] {
  width: calc(100% - 20px);
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #0056b3;
}
</style>
<div id="chat-container">
  <div id="messages"></div>
  <input type="text" id="username" placeholder="Enter your username">
  <textarea id="message-input" placeholder="Type your message..."></textarea>
  <button id="send-button">Send</button>
</div>
`

customElements.define('my-chat-app',

  /**
   * Represents a message app element.
   */
  class extends HTMLElement {
    #messagesContainer
    #usernameInput
    #messageInput
    #sendButton
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
      this.shadowRoot.appendChild(template.content.cloneNode(true))
      this.#messagesContainer = this.shadowRoot.querySelector('#messages')
      this.#usernameInput = this.shadowRoot.querySelector('#username')
      this.#messageInput = this.shadowRoot.querySelector('#message-input')
      this.#sendButton = this.shadowRoot.querySelector('#send-button')

      this.connectWebSocket()
    }

    /**
     * Connect to lnu websocket server.
     */
    connectWebSocket () {
      this.websocket = new WebSocket('wss://courselab.lnu.se/message-app/socket')

      this.websocket.addEventListener('open', () => {
        console.log('WebSocket connected')
      })

      this.websocket.addEventListener('message', (event) => {
        const message = JSON.parse(event.data)
        if (message.type === 'message') {
          this.displayMessage(message)
        } else if (message.type === 'heartbeat') {
          // Ignore heartbeat messages
        }
      })

      this.websocket.addEventListener('close', () => {
        console.log('WebSocket closed. Reconnecting...')
        setTimeout(() => this.connectWebSocket(), 1000)
      })

      this.websocket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error)
      })
    }

    /**
     * Displays a message in the chat interface.
     *
     * @param {object} message - The message object containing username and message data.
     */
    displayMessage (message) {
      const messageElement = document.createElement('div')
      messageElement.classList.add('message')
      messageElement.textContent = `${message.username}: ${message.data}`
      this.#messagesContainer.appendChild(messageElement)
      this.#messagesContainer.scrollTop = this.#messagesContainer.scrollHeight
    }
  }
)
