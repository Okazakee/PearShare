import { useContext, useState } from 'react';
import PearContext from './contexts/PearContext';
import FilePicker from './components/FilePicker';
import pearlogo from './assets/pear.png'
import './App.css';

function App() {
  const { yourLink, connectToPeer, sendFile, isLoading } = useContext(PearContext);
  const [friendLink, setFriendLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleConnect = () => {
    connectToPeer(friendLink);
  };

  const handleSend = () => {
    if (selectedFile) {
      sendFile(selectedFile);
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <main className="container">
      <div className="header">
        <div className="hero">
          <img src={pearlogo} className="pear-logo" alt="Pear logo" />
          <h1 className="title">PearShare</h1>
        </div>
        <h2 className="desc">Share anything you like with your pear friends using P2P!</h2>
      </div>

      <div className="body">
        <div className="top-input">
          <label className="label">Pear friend link:
            <input
              className="input-text"
              type="text"
              value={friendLink}
              onChange={(e) => setFriendLink(e.target.value)}
              placeholder="pear://..."
            />
          </label>
        </div>

        <div className="bot-section">
          <div className="bot-input">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label className="label">Select file:
              <FilePicker selectedFile={selectedFile} setSelectedFile={setSelectedFile} />
            </label>
          </div>
          {isLoading && <div className="loading-indicator">Initializing P2P connection...</div>}
          <button type="submit" onClick={handleSend}>Send file!</button>
        </div>
      </div>

      <p className="your-link">Your link: <span className="your-link-label">{yourLink}</span></p>
    </main>
  );
}

export default App;