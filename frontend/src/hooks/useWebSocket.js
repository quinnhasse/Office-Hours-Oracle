import { useEffect, useState } from 'react'

/**
 * Simple WebSocket hook for real-time queue updates
 */
export default function useWebSocket(url) {
  const [message, setMessage] = useState(null)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    // Create WebSocket connection
    const websocket = new WebSocket(url)

    websocket.onopen = () => {
      console.log('WebSocket connected')
    }

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        setMessage(data)
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err)
      }
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    websocket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    setWs(websocket)

    // Cleanup on unmount
    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close()
      }
    }
  }, [url])

  return { message, ws }
}
