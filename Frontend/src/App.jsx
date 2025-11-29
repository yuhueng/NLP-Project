import React from 'react'
import ModernChatApp from './components/ModernChatApp'
import useChat from './hooks/useChat'

function App() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    isLoading
  } = useChat()

  return (
    <ModernChatApp
      messages={messages}
      inputMessage={inputMessage}
      setInputMessage={setInputMessage}
      sendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}

export default App