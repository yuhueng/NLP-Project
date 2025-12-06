import React from 'react'

function LeftSidebar({ onNewChat, onPersonaChange, currentPersona = "singlish" }) {
  const personas = [
    {
      id: "singlish",
      name: "Singlish",
      icon: "🇸🇬",
      description: "Friendly Singaporean assistant",
      endpoint: "/chat/singlish"
    },
    {
      id: "xmm",
      name: "XMM",
      icon: "💁‍♀️",
      description: "XMM personality chatbot",
      endpoint: "/chat/xmm"
    },
    {
      id: "ahbeng",
      name: "Ah Beng",
      icon: "😎",
      description: "Classic Ah Beng style",
      endpoint: "/chat/ahbeng"
    },
    {
      id: "nsf",
      name: "NSF",
      icon: "🎖️",
      description: "National Serviceman persona",
      endpoint: "/chat/nsf"
    }
  ]

  return (
    <div className="w-80 bg-gray-800 dark:bg-gray-900 border-r border-gray-700 dark:border-gray-600 flex flex-col h-full">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-700 dark:border-gray-600">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Persona Selector */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider mb-3">Persona</h3>
        <div className="space-y-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersonaChange && onPersonaChange(persona.id)}
              className={`w-full px-3 py-2 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                currentPersona === persona.id
                  ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                  : 'bg-gray-700 dark:bg-gray-800 text-gray-300 dark:text-gray-400 hover:bg-gray-600 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl">{persona.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{persona.name}</p>
                <p className="text-xs opacity-70">{persona.description}</p>
              </div>
              {currentPersona === persona.id && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar