import React from 'react'
import AppLayout from './AppLayout'
import useChat from './hooks/useChat'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const {
    messages,
    inputMessage,
    setInputMessage,
    sendMessage,
    isLoading,
    isBackendReady
  } = useChat()

  return (
    <ThemeProvider>
      <AppLayout
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        sendMessage={sendMessage}
        isLoading={isLoading}
        isBackendReady={isBackendReady}
      />
    </ThemeProvider>
  )
}

export default App