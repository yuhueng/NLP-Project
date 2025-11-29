import React, { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

function ChatWindow({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="h-full overflow-y-auto px-6 py-4 space-y-2">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-lg font-medium text-text mb-2">
              Welcome to Singlish Chatbot! 🇸🇬
            </h2>
            <p className="text-sm text-gray-500">
              Start a conversation by typing a message below.
            </p>
          </div>
        </div>
      )}

      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          message={message.content}
          isUser={message.role === 'user'}
        />
      ))}

      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-bot-bubble text-text px-4 py-2 rounded-lg rounded-bl-none">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatWindow