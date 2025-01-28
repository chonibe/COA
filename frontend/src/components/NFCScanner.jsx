import React, { useState } from 'react';
import { useNfc } from 'react-nfc-manager';

function NFCScanner() {
  const [nfcData, setNfcData] = useState(null);
  const { read, write } = useNfc();

  const handleRead = async () => {
    try {
      const tag = await read();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/coas/${tag.id}`);
      setNfcData(await response.json());
    } catch (error) {
      console.error('NFC Read Error:', error);
    }
  };

  const handleWrite = async (coaId) => {
    try {
      await write({
        records: [{
          recordType: 'url',
          data: `${window.location.origin}/coa/${coaId}`
        }]
      });
      alert('NFC Tag Written Successfully!');
    } catch (error) {
      console.error('NFC Write Error:', error);
    }
  };

  return (
    <div>
      <button onClick={handleRead}>Scan NFC Tag</button>
      {nfcData && (
        <div className="nfc-data">
          <h3>{nfcData.product_title}</h3>
          <p>Edition: {nfcData.edition_number}</p>
        </div>
      )}
    </div>
  );
}

export default NFCScanner;