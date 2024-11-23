import React, { useState } from 'react';
import LaunchPage from './src/components/LaunchPage';
import ProfilePage from './src/components/ProfilePage';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import LoginPage from './src/components/LoginPage';
import RegisterPage from './src/components/RegisterPage';
import GroupPage from './src/components/GroupPage'
import FinancePage from './src/components/FinancePage'
import Group from './src/components/Group';
import CreateGroup from './src/components/CreateGroup';

const Stack = createStackNavigator()

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'LaunchPage'}>
        <Stack.Screen name={'LaunchPage'} component={LaunchPage} options={{title: false}}/>

        <Stack.Screen name={'LoginPage'} component={LoginPage}/>

        <Stack.Screen name={'RegisterPage'} component={RegisterPage}/>

        <Stack.Screen name={'ProfilePage'} component={ProfilePage}/>

        <Stack.Screen name={'GroupPage'} component={GroupPage}/>

        <Stack.Screen name={'FinancePage'} component={FinancePage}/>

        <Stack.Screen name={'Group'} component={Group}/>

        <Stack.Screen name={'CreateGroup'} component={CreateGroup}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}