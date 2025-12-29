// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your page components
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import HistoryPage from './components/HistoryPage';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="Register" component={RegisterPage} />
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="Profile" component={ProfilePage} />
        <Stack.Screen name="History" component={HistoryPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;