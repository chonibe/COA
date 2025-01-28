import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NFCWriter = ({ coaId }) => {
  const [status, setStatus] = useState('idle');
  const { user } = useAuth();

  const writeTag = async () => {
    try {
      const writer = new window.NDEFWriter();
      await writer.write({
        records: [{
          recordType: 'url',
          data: `${window.location.origin}/coa/${coaId}`
        }]
      });

      // Lock the tag
      await fetch(`${process.env.REACT_APP_API_URL}/nfc/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          uid: writer.uid,
          coaId
        })
      });

      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error('NFC Write Error:', error);
    }
  };

  return (
    <div className="nfc-writer">
      <button 
        onClick={writeTag}
        disabled={status === 'success'}
      >
        {status === 'success' ? 'Tag Encoded!' : 'Write NFC Tag'}
      </button>
      {status === 'error' && <p className="error">NFC Write Failed</p>}
    </div>
  );
};

export default NFCWriter;