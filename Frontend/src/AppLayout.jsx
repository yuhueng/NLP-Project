import { useState } from 'react'
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import ChatWindow from './components/ChatWindow'

function AppLayout({ messages, inputMessage, setInputMessage, sendMessage, isLoading, isBackendReady, currentPersona, setCurrentPersona }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleNewChat = () => {
    // Clear messages and start fresh chat - needs to be implemented in useChat
    setInputMessage('')
    window.location.reload() // Temporary solution to clear chat
  }

  const handlePersonaChange = (personaId) => {
    setCurrentPersona(personaId)
    // You might want to apply persona-specific settings here
  }

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <Header
        title="Multi-Persona Chatbot"
        subtitle={`Active Persona: ${currentPersona.charAt(0).toUpperCase() + currentPersona.slice(1)}`}
      />

      {/* Main Content Area - Takes remaining height */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Collapsible */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 flex-shrink-0 overflow-hidden`}>
          <LeftSidebar
            onNewChat={handleNewChat}
            onPersonaChange={handlePersonaChange}
            currentPersona={currentPersona}
          />
        </div>

        {/* Toggle Sidebar Button - Visible when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed left-4 top-20 z-20 p-3 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Chat Window - Takes remaining space */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Messages:</span>
              <span className="px-2 py-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full text-xs">
                {messages.length}
              </span>
            </div>
          </div>

          <ChatWindow
            messages={messages}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            isLoading={isLoading}
            isBackendReady={isBackendReady}
            currentPersona={currentPersona}
          />
        </div>
      </div>

      {/* Mobile overlay - Closes sidebar when clicking outside */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AppLayout