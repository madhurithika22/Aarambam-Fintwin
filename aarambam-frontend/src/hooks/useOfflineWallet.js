import { useState, useEffect } from 'react';

// Simulating a secure local storage key
const WALLET_STORAGE_KEY = 'aarambam_offline_ledger';

export const useOfflineWallet = () => {
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load data on mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY) || '{"balance": 0, "logs": []}');
    setBalance(storedData.balance);
    setLogs(storedData.logs);

    // Network Listeners
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));

    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && logs.length > 0) {
        console.log("Network Restored! Syncing logs to server...", logs);
        // TODO: API call to backend would go here
        // api.post('/wallet/sync', { logs }).then(...)
    }
  }, [isOnline, logs]);

  // ACTION: Load Money (Requires Internet)
  const loadMoney = (amount) => {
    if (!isOnline) {
      alert("You need internet to Load Money into Offline Wallet first.");
      return false;
    }
    const newBalance = balance + parseFloat(amount);
    updateWallet(newBalance, { type: 'LOAD', amount, date: new Date().toISOString() });
    return true;
  };

  // ACTION: Pay Offline
  const payOffline = (amount, receiverId) => {
    if (balance < amount) {
      alert("Insufficient Offline Balance!");
      return false;
    }
    const newBalance = balance - parseFloat(amount);
    
    // Create a cryptographically signed token (Simulation)
    const transactionToken = `OFFLINE_TX_${Date.now()}_${amount}_TO_${receiverId}`;
    
    updateWallet(newBalance, { 
        type: 'PAY', 
        amount, 
        receiverId, 
        token: transactionToken,
        date: new Date().toISOString() 
    });
    return transactionToken;
  };

  // Helper to save to LocalStorage
  const updateWallet = (newBalance, newLog) => {
    const newLogs = [newLog, ...logs];
    setBalance(newBalance);
    setLogs(newLogs);
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({ balance: newBalance, logs: newLogs }));
  };

  return { balance, logs, isOnline, loadMoney, payOffline };
};