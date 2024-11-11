import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import LaunchPage from './src/components/LaunchPage';
import ProfilePage from './src/components/ProfilePage'; // Importando ProfilePage

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função chamada após login bem-sucedido
  const onLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Função chamada para logout
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