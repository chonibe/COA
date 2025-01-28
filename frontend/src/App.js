import React from 'react'; // Add this line
import { AppProvider, Button } from '@shopify/polaris';

function MainApp() {
  const handleLogin = () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/shopify?shop=thestreetlamp.com`;
  };

  return (
    <AppProvider>
      <div className="MainApp">
        <h1>COA Authentication System</h1>
        <Button primary onClick={handleLogin}>
          Login with Shopify
        </Button>
      </div>
    </AppProvider>
  );
}

export default MainApp;