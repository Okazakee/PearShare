import React, { createContext, useEffect, useState } from 'react';
import Hyperswarm from 'hyperswarm';
import Hyperdrive from 'hyperdrive';
import Corestore from 'corestore';
import b4a from 'b4a';

const PearContext = createContext();

export const PearProvider = ({ children }) => {
  const [drive, setDrive] = useState(null);
  const [swarm, setSwarm] = useState(null);
  const [store, setStore] = useState(null);
  const [yourLink, setYourLink] = useState('');
  const [peerDrive, setPeerDrive] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initP2P() {
      try {
        setIsLoading(true);
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

  const connectToPeer = async (peerLink) => {
    if (!store || !swarm) return false;

    try {
      if (!peerLink.startsWith('pear://')) {
        throw new Error('Invalid peer link format');
      }

      const key = peerLink.replace('pear://', '');
      const peerKey = b4a.from(key, 'z32');

      const newPeerDrive = new Hyperdrive(store, peerKey);
      await newPeerDrive.ready();

      swarm.join(newPeerDrive.discoveryKey);

      setPeerDrive(newPeerDrive);
      return true;
    } catch (error) {
      console.error('Failed to connect to peer:', error);
      return false;
    }
  };

  const sendFile = async (file) => {
    if (!drive || !peerDrive) return false;

    try {
      const buffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(Buffer.from(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const path = `/${file.name}`;
      await drive.put(path, buffer);

      return true;
    } catch (error) {
      console.error('Failed to send file:', error);
      return false;
    }
  };

  return (
    <PearContext.Provider value={{
      drive,
      swarm,
      store,
      yourLink,
      peerDrive,
      isConnected,
      isLoading,
      connectToPeer,
      sendFile
    }}>
      {children}
    </PearContext.Provider>
  );
};

export default PearContext;