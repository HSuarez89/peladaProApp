import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import LaunchPage from './src/components/LaunchPage';

export default function App() {
  return (
    <View>
      <LaunchPage/>
      <StatusBar style="auto" />
    </View>
  );
}