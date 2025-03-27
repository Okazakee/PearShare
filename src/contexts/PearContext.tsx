import React, { createContext, useEffect, useState } from 'react';

const PearContext = createContext();

export const PearProvider = ({ children }) => {
  const [drive, setDrive] = useState(null);
  const [swarm, setSwarm] = useState(null);
  const [store, setStore] = useState(null);
  const [yourLink, setYourLink] = useState('pear://nykmkrpwgadcd8m9x5khhh43j9izj123eguzqg3ygta7yn1s379o'); // Default for testing
  const [peerDrive, setPeerDrive] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if Pear is available
    if (typeof Pear === 'undefined') {
      console.warn('Pear environment not detected, running in demo mode');
      setIsLoading(false);
      return;
    }

    async function initP2P() {
      try {
        setIsLoading(true);

        // Dynamic imports to handle environments where these modules aren't available
        const { default: Hyperswarm } = await import('hyperswarm');
        const { default: Hyperdrive } = await import('hyperdrive');
        const { default: Corestore } = await import('corestore');
        const { default: b4a } = await import('b4a');

        const newStore = new Corestore(Pear.config.storage);
        const newSwarm = new Hyperswarm();
        const newDrive = new Hyperdrive(newStore);

        await newDrive.ready();

        newSwarm.on('connection', (conn) => {
          newStore.replicate(conn);
          setIsConnected(true);
          console.log('Peer connected');
        });

        newSwarm.join(newDrive.discoveryKey);

        setStore(newStore);
        setSwarm(newSwarm);
        setDrive(newDrive);
        setYourLink(`pear://${b4a.toString(newDrive.key, 'z32')}`);

        Pear.teardown(() => newSwarm.destroy());
      } catch (error) {
        console.error('Failed to initialize P2P:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initP2P();
  }, []);

  // Other methods remain the same

  return (
    <PearContext.Provider value={{
      drive,
      swarm,
      store,
      yourLink,
      peerDrive,
      isConnected,
      isLoading,
      connectToPeer: async () => console.log('Connect to peer called'), // Dummy implementation for testing
      sendFile: async () => console.log('Send file called') // Dummy implementation for testing
    }}>
      {children}
    </PearContext.Provider>
  );
};

export default PearContext;