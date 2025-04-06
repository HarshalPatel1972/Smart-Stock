import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/use-websocket';
import { Product, Activity } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

interface AppContextType {
  newActivity: Activity | null;
  lowStockAlert: Product | null;
  clearNotification: () => void;
  isConnected: boolean;
}

// Create a default context value to prevent the undefined error
const defaultContextValue: AppContextType = {
  newActivity: null,
  lowStockAlert: null,
  clearNotification: () => {},
  isConnected: false,
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [newActivity, setNewActivity] = useState<Activity | null>(null);
  const [lowStockAlert, setLowStockAlert] = useState<Product | null>(null);
  const { toast } = useToast();
  
  // Connect to WebSocket with more resilient error handling
  const { lastMessage, isConnected, socket } = useWebSocket('/ws', {
    reconnectInterval: 2000,
    reconnectAttempts: 5
  });
  
  // Log connection status
  useEffect(() => {
    console.log('WebSocket connection status:', isConnected ? 'Connected' : 'Disconnected');
  }, [isConnected]);
  
  // Process WebSocket messages with improved error handling
  useEffect(() => {
    if (lastMessage) {
      try {
        console.log('Processing WebSocket message:', lastMessage);
        const message = JSON.parse(lastMessage);
        
        switch (message.type) {
          case 'NEW_ACTIVITY':
            if (message.data) {
              setNewActivity(message.data);
              toast({
                title: "New Activity",
                description: message.data.description || "New activity recorded",
                duration: 5000,
              });
            }
            break;
            
          case 'LOW_STOCK_ALERT':
            if (message.data) {
              setLowStockAlert(message.data);
              toast({
                title: "Low Stock Alert",
                description: `${message.data.name || "Product"} is low on stock (${message.data.quantity || 0} remaining)`,
                variant: "destructive",
                duration: 5000,
              });
            }
            break;
            
          case 'PRODUCT_UPDATED':
            if (message.data) {
              toast({
                title: "Product Updated",
                description: `${message.data.name || "Product"} has been updated`,
                duration: 3000,
              });
            }
            break;
            
          case 'PRODUCT_CREATED':
            if (message.data) {
              toast({
                title: "Product Created",
                description: `${message.data.name || "Product"} has been added to inventory`,
                duration: 3000,
              });
            }
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    }
  }, [lastMessage, toast]);
  
  const clearNotification = () => {
    setNewActivity(null);
    setLowStockAlert(null);
  };
  
  return (
    <AppContext.Provider 
      value={{
        newActivity,
        lowStockAlert,
        clearNotification,
        isConnected
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  // This won't throw now since we have a default value
  return context;
};
