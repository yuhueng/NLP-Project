import React from 'react'

function MessageBubble({ message, isUser }) {
  return (
    <div
      className={`flex mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-user-bubble text-white rounded-br-none'
            : 'bg-bot-bubble text-text rounded-bl-none'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message}
        </p>
        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {new Date().toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble