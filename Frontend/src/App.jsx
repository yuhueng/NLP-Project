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
    isBackendReady,
    currentPersona,
    setCurrentPersona
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
        currentPersona={currentPersona}
        setCurrentPersona={setCurrentPersona}
      />
    </ThemeProvider>
  )
}

export default App