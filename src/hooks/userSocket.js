import { useEffect, useRef } from "react"
import { io } from "socket.io-client"

const BACKEND_URL = "http://localhost:4000"

export const useSocket = () => {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(BACKEND_URL, {
      withCredentials: true,
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [])

  return socketRef.current
}