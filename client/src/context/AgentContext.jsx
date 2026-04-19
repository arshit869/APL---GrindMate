import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocket } from './SocketContext';

const AgentContext = createContext(null);

export function AgentProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const { socket } = useSocket();

  // Listen for agent activities
  useEffect(() => {
    if (!socket) return;

    const handleActivity = (activity) => {
      setActivities(prev => {
        const updated = [{ ...activity, timestamp: activity.timestamp || new Date().toISOString() }, ...prev];
        return updated.slice(0, 20); // Keep last 20
      });
    };

    const handleInitialLog = (log) => {
      if (Array.isArray(log)) {
        setActivities(log.slice(0, 20));
      }
    };

    socket.on('agent:activity', handleActivity);
    socket.on('agent:log', handleInitialLog);

    return () => {
      socket.off('agent:activity', handleActivity);
      socket.off('agent:log', handleInitialLog);
    };
  }, [socket]);

  const addActivity = useCallback((activity) => {
    setActivities(prev => [
      { ...activity, timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 20));
  }, []);

  const togglePanel = useCallback(() => {
    setPanelOpen(prev => !prev);
  }, []);

  return (
    <AgentContext.Provider value={{ activities, panelOpen, togglePanel, addActivity }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  return useContext(AgentContext);
}
