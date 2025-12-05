import React, { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'

function ChatWindow({
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  isLoading,
  isBackendReady = true,
  currentPersona = "default"
}) {
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [inputMessage])

  const handleSend = () => {
    if (!inputMessage.trim()) return
    sendMessage(inputMessage.trim())
    setInputMessage('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getQuickPrompts = () => {
    switch(currentPersona) {
      case 'singlish':
        return [
          "Can you explain this Singlish phrase?",
          "What's the best hawker centre?",
          "How do I get around Singapore?",
          "Tell me about local customs",
          "Weather today",
          "MRT guide"
        ]
      case 'ahbeng':
        return [
          "What's good bro?",
          "Where got best kopi?",
          "Recommend me some shiok places",
          "Talk about cars leh",
          "What's happening tonight?",
          "Tell me your story"
        ]
      default: // xmm and others
        return [
          "What's trending today?",
          "Tell me something interesting",
          "What do you think about...",
          "Can you help me with...",
          "What's your opinion on...",
          "Tell me a story"
        ]
    }
  }

  const quickPrompts = getQuickPrompts()

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {!isBackendReady ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl animate-pulse">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Waking up the backend...</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              The backend server is starting up. This may take a moment if it was inactive.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <span className="ml-2">Connecting to backend...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5m-1-4H7m4 0v8m-4 0h2m3 0h2m-6-0h2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to {currentPersona.charAt(0).toUpperCase() + currentPersona.slice(1)} Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              {currentPersona === 'singlish'
                ? "Ask me anything about Singapore culture, Singlish phrases, local food, or anything else!"
                : currentPersona === 'ahbeng'
                ? "Wah bro! Talk to me about anything lah - cars, food, life stories, you name it!"
                : "Chat with the XMM persona! Ask me anything you like."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(prompt)}
                  className="px-4 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-sm text-left border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <MessageBubble
                  message={message.content}
                  isUser={message.role === 'user'}
                  safety={message.safety}
                />
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={!isBackendReady ? "Waiting for backend to start..." : `Message chatbot... (${currentPersona} persona)`}
              disabled={!isBackendReady}
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                minHeight: '48px',
                maxHeight: '120px',
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading || !isBackendReady}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18-9-2 9z" />
            </svg>
          </button>
        </div>

        {/* Quick prompts below input (shown when no messages) */}
        {messages.length === 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {quickPrompts.slice(0, 4).map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt)}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ChatWindow