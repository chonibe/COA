import React from 'react';
import { AppProvider, Button } from '@shopify/polaris';

// Rename your main component to something unique
function CoaSystem() {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/shopify?shop=thestreetlamp.com`;
  };

  return (
    <AppProvider>
      <div className="App">
        <h1>COA Authentication System</h1>
        <Button primary onClick={handleLogin}>
          Login with Shopify
        </Button>
      </div>
    </AppProvider>
  );
}

export default CoaSystem; // Changed from App to CoaSystem