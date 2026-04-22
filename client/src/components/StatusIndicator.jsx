import { useState, useEffect } from 'react';

const StatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '10px' }}>
      <div 
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: isOnline ? '#4CAF50' : '#F44336', // Verde ou Vermelho
          boxShadow: isOnline ? '0 0 8px #4CAF50' : '0 0 8px #F44336'
        }} 
      />
    </div>
  );
};

export default StatusIndicator;