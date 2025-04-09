import { useEffect, useState, useRef, useCallback } from "react";

interface UseWebSocketOptions {
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  lastMessage: string | null;
  sendMessage: (message: any) => void;
}

export function useWebSocket(
  path: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const reconnectCount = useRef<number>(0);
  const maxReconnectAttempts = options.reconnectAttempts || 10;
  const reconnectInterval = options.reconnectInterval || 3000;

  // Make connect function available across effects
  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}${path}`;

      console.log(`Connecting to WebSocket at: ${wsUrl}`);

      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        reconnectCount.current = 0;
      };

      ws.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        setLastMessage(event.data);
      };

      ws.onclose = (event) => {
        console.log(
          `WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
        );
        setIsConnected(false);
        setSocket(null);

        // Try to reconnect
        if (reconnectCount.current < maxReconnectAttempts) {
          reconnectCount.current += 1;
          console.log(
            `Scheduling reconnect attempt (${reconnectCount.current}/${maxReconnectAttempts}) in ${reconnectInterval}ms...`
          );

          // Use setTimeout instead of passing to connect directly to avoid closure issues
          setTimeout(() => {
            console.log(
              `Attempting to reconnect (${reconnectCount.current}/${maxReconnectAttempts})...`
            );
            connect();
          }, reconnectInterval);
        } else {
          console.log("Max reconnect attempts reached. Giving up.");
          // Application can still function without WebSocket
          setLastMessage(null);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        // Don't close the socket on error - let the onclose handler deal with that
      };

      setSocket(ws);

      return ws;
    } catch (error) {
      console.error("Error setting up WebSocket:", error);
      // Provide a fallback to avoid app crashing
      setIsConnected(false);
      setLastMessage(null);
      return null;
    }
  }, [path, maxReconnectAttempts, reconnectInterval]);

  // Setup WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;

    // Attempt to connect with a slight delay to ensure the DOM is fully loaded
    const connectionTimer = setTimeout(() => {
      ws = connect();
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (ws) {
        // Properly handle cleanup to avoid memory leaks
        ws.onclose = null;
        ws.onerror = null;
        ws.onmessage = null;
        ws.onopen = null;
        ws.close();
      }
      clearTimeout(connectionTimer);
    };
  }, [connect]);

  // Send message helper with improved error handling
  const sendMessage = useCallback(
    (message: any) => {
      if (socket && isConnected && socket.readyState === WebSocket.OPEN) {
        try {
          socket.send(
            typeof message === "string" ? message : JSON.stringify(message)
          );
        } catch (error) {
          console.error("Error sending message via WebSocket:", error);
        }
      } else {
        console.warn("Cannot send message: WebSocket is not connected");
      }
    },
    [socket, isConnected]
  );

  return {
    socket,
    isConnected,
    lastMessage,
    sendMessage,
  };
}
