/**
 * The chat app web component module.
 *
 * @author Leia Lindberg <ll224np@student.lnu.se>
 * @version 1.0.0
 */

import 'emoji-picker-element'

const template = document.createElement('template')
template.innerHTML = `
<style>
#chat-container {
  width: 80%;
  max-width: 600px;
  height: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #6e5483;
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
  background-color: #9a82af;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}
#emoji-button {
  padding: 10px;
  font-size: 14px;
}

button:hover {
  background-color: #baaec5;
}
.message {
    background-color:#6e5483;
    color: #fff;
    padding: 10px;
    margin-bottom: 5px;
    max-width: 80%; /* Limit width to avoid too wide messages */
    border-radius: 8px;
    align-self: flex-start; /* Align messages to the left */
    font-size: 14px;
    line-height: 1.4;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  }

  .message.own-message {
    background-color: #6e5483;
    color: #fff;
    align-self: flex-end; /* Align user's own messages to the right */
  }

  #username, #message-input {
    width: calc(100% - 20px);
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  emoji-picker {
  display: none;
  width: 400px;
    height: 300px;
    position: absolute;
    bottom: 50px;
    right: 20px;
    display: none;
    z-index: 1;
}
</style>
<div id="chat-container">
  <div id="messages"></div>
  <input type="text" id="username" placeholder="Enter your username">
  <textarea id="message-input" placeholder="Type your message..."></textarea>
  <button id="send-button">Send</button>
  <button id="emoji-button">😀</button>
  <emoji-picker class="light"></emoji-picker>
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
    #maxMessages = 20
    #emojiPicker
    #emojiButton
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
      this.#emojiPicker = this.shadowRoot.querySelector('emoji-picker')
      this.#emojiButton = this.shadowRoot.querySelector('#emoji-button')

      this.#sendButton.addEventListener('click', () => this.sendMessage())
      this.#messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault()
          this.sendMessage()
        }
      })
      this.#emojiButton.addEventListener('click', () => this.toggleEmojiPicker())

      this.#emojiPicker.addEventListener('emoji-click', (event) => {
        const emoji = event.detail.emoji.unicode
        console.log(emoji)
        this.#messageInput.value += emoji
      })

      this.connectWebSocket()
      this.loadUsername()
    }

    /**
     * Loud the username.
     */
    loadUsername () {
      const savedUsername = localStorage.getItem('username')
      if (savedUsername) {
        this.#usernameInput.value = savedUsername
        this.#usernameInput.setAttribute('readonly', true)
      } else {
        this.#usernameInput.addEventListener('blur', () => {
          const username = this.#usernameInput.value.trim()
          if (username) {
            localStorage.setItem('username', username)
            this.#usernameInput.setAttribute('readonly', true)
          }
        })
      }
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
        } else if (message.type === 'notification') {
          this.displayMessage(message) // Ensure to display notifications correctly
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
     * Sending a message.
     */
    sendMessage () {
      const username = localStorage.getItem('username')
      const messageText = this.#messageInput.value.trim()
      if (messageText && username) {
        const message = {
          type: 'message',
          data: messageText,
          username: username,
          channel: 'my, not so secret, channel',
          key: import.meta.env.VITE_API
        }
        this.websocket.send(JSON.stringify(message))
        this.#messageInput.value = ''
      }
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

      const messageElements = this.#messagesContainer.querySelectorAll('.message')
      if (messageElements.length >= this.#maxMessages) {
        this.#messagesContainer.removeChild(messageElements[0]) // Remove the oldest message
      }
      this.#messagesContainer.appendChild(messageElement)

      this.#messagesContainer.scrollTop = this.#messagesContainer.scrollHeight
    }

    /**
     * Toggle the emoji picker.
     */
    toggleEmojiPicker () {
      this.#emojiPicker.style.display = (this.#emojiPicker.style.display === 'block') ? 'none' : 'block'
    }

    /**
     * Disconnect from DOM.
     */
    disconnectedCallback () {
      if (this.websocket) {
        this.websocket.close()
      }
      console.log('MyChatComponent disconnected from the DOM')
    }
  }
)
