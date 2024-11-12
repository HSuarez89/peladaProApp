import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import LaunchPage from './src/components/LaunchPage';
import ProfilePage from './src/components/ProfilePage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const onLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isAuthenticated ? (
        <ProfilePage onLogout={onLogout} />
      ) : (
        <LaunchPage onLoginSuccess={onLoginSuccess} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}