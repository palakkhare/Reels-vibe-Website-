import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io('/', {
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        newSocket.emit('user:online', user._id);
      });

      newSocket.on('user:status', ({ userId, isOnline }) => {
        setOnlineUsers(prev => {
          const updated = new Set(prev);
          if (isOnline) updated.add(userId);
          else updated.delete(userId);
          return updated;
        });
      });

      newSocket.on('chat:newMessage', () => {
        setUnreadMessages(prev => prev + 1);
      });

      newSocket.on('notification:new', () => {
        setUnreadNotifications(prev => prev + 1);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
        socketRef.current = null;
      };
    }
  }, [user?._id]);

  const isUserOnline = (userId) => onlineUsers.has(userId);

  const resetUnreadMessages = () => setUnreadMessages(0);
  const resetUnreadNotifications = () => setUnreadNotifications(0);

  return (
    <SocketContext.Provider value={{
      socket, onlineUsers, isUserOnline,
      unreadMessages, unreadNotifications,
      resetUnreadMessages, resetUnreadNotifications,
    }}>
      {children}
    </SocketContext.Provider>
  );
}
