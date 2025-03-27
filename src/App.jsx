import { useContext, useState } from 'react';
import PearContext from './contexts/PearContext';
import './App.css';
import pearLogo from './assets/pear.png';

function App() {
  const { yourLink, connectToPeer, sendFile, isLoading } = useContext(PearContext);
  const [friendLink, setFriendLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleConnect = async () => {
    const success = await connectToPeer(friendLink);
    if (success) {
      console.log('Connected to peer successfully');
    } else {
      alert('Failed to connect to peer');
    }
  };

  const handleSend = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const success = await sendFile(selectedFile);
    if (success) {
      alert('File sent successfully!');
    } else {
      alert('Failed to send file');
    }
  };

  return (
    <main className="container">

      <div className="header">
        <div className="hero">
          <img src="/pear.png" className="pear-logo" alt="Pear logo" />
          <h1 className="title">PearShare</h1>
        </div>

        <h2 className="desc">Share anything you like with your pear friends using P2P!</h2>

      </div>

      <div className="body">
        <div className="top-input">

          <label aria-label="A label" className="label">Pear friend link:
            <input className="input-text" type="text" placeholder="pear://8ts9yz9dtucxzwbxafygnjasqe9ti3dt3w7rm6sbiu8prmidacao" />
          </label>

        </div>

        <div className="bot-section">
          <div className="bot-input">

            <label className="label">Select file:
              <input className="input-text" type="text" placeholder="file.mp4" />
            </label>

          </div>

          <button type="submit">Send file!</button>
        </div>
      </div>

      <p className="your-link">Your link: <h3 className="your-link-label">pear://nykmkrpwgadcd8m9x5khhh43j9izj123eguzqg3ygta7yn1s379o</h3></p>


    </main>
  );
}