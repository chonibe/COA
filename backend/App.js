import React from 'react';
import { useWebNFC } from 'react-web-nfc';

function App() {
  const { scan, isSupported } = useWebNFC();
  const [coaData, setCoaData] = React.useState(null);

  const handleScan = async () => {
    try {
      const tag = await scan();
      alert('Scanned NFC tag!');
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  return (
    <div className="App">
      <h1>Certificate of Authenticity</h1>
      {isSupported ? (
        <button onClick={handleScan}>Scan NFC Tag</button>
      ) : (
        <p>NFC not supported on this device</p>
      )}
    </div>
  );
}

export default App;