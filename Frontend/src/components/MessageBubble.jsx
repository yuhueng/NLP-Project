import React, { useState } from 'react'

function MessageBubble({ message, isUser, safety }) {
  const [isRevealed, setIsRevealed] = useState(false)

  // Function to censor text (replace with asterisks or other characters)
  const censorText = (text) => {
    return '[Content Hidden - Click to Reveal]'
  }

  // Determine if content should be censored
  const shouldCensor = !isUser && safety === 'Unsafe' && !isRevealed

  return (
    <div
      className={`flex mb-4 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-none'
            : shouldCensor
            ? 'bg-red-100 dark:bg-red-900 text-gray-900 dark:text-gray-100 rounded-bl-none border-2 border-red-300 dark:border-red-600'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
        }`}
      >
        {/* Safety warning for unsafe content */}
        {shouldCensor && (
          <div className="mb-2 text-red-600 dark:text-red-400 text-xs font-medium">
            ⚠️ This content has been flagged as potentially inappropriate
          </div>
        )}

        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            shouldCensor ? 'cursor-pointer hover:text-red-700 dark:hover:text-red-300' : ''
          }`}
          onClick={() => {
            if (shouldCensor) {
              setIsRevealed(true)
            }
          }}
        >
          {shouldCensor ? censorText(message) : message}
        </p>

        <p
          className={`text-xs mt-1 ${
            isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {new Date().toLocaleTimeString('en-SG', {
            hour: '2-digit',
            minute: '2-digit'
          })}
          {!isUser && safety === 'Unsafe' && ' • ⚠️ Unsafe'}
        </p>
      </div>
    </div>
  )
}

export default MessageBubble