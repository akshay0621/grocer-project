// LoginPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { API_URL } from '@env';

const LoginPage = ({ navigation }) => {
  const [user_name, setName] = useState('');
  const [user_password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // This effect runs once on component mount to load and attempt auto-login
  useEffect(() => {
    const loadSavedCredentialsAndLogin = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('savedUsername');
        const savedPassword = await AsyncStorage.getItem('savedPassword');

        if (savedUsername && savedPassword) {
          setName(savedUsername); // Pre-fill username field
          setPassword(savedPassword); // Pre-fill password field

          // Attempt login with stored credentials
          await executeLogin(savedUsername, savedPassword);
        }
      } catch (e) {
        // Error reading from AsyncStorage
        // Optionally, clear saved credentials if they caused an issue
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('savedPassword');
      }
    };
    loadSavedCredentialsAndLogin();
  }, []);

  const executeLogin = async (usernameToLogin, passwordToLogin) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user_login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: usernameToLogin, user_password: passwordToLogin }),
      });

      const data = await response.json();

      if (response.ok) {
        // Save credentials after successful login
        await AsyncStorage.setItem('savedUsername', usernameToLogin);
        await AsyncStorage.setItem('savedPassword', passwordToLogin); // ⚠️ SECURITY RISK

        navigation.navigate('Home', { loggedInUserName: usernameToLogin });
      } else {
        setError(data.message || 'Login failed. Please try again.');
        // Clear saved credentials if login fails with them
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('savedPassword');
      }
    } catch (loginError) {
      setError('Failed to connect to the server. Please check your network connection.');
      // Clear saved credentials on network error too
      await AsyncStorage.removeItem('savedUsername');
      await AsyncStorage.removeItem('savedPassword');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginButtonPress = () => {
    executeLogin(user_name, user_password);
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-4`}>
      <Text style={tw`text-3xl font-bold mb-6 text-blue-600`}>Login</Text>
      <TextInput
        style={tw`w-full px-4 py-2 mb-4 border border-gray-300 rounded-md text-gray-800`}
        placeholder="User Name"
        value={user_name}
        onChangeText={setName}
        placeholderTextColor={tw.color('gray-400')}
        autoCapitalize="none"
      />
      <View style={tw`w-full relative mb-6`}>
        <TextInput
          style={tw`w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800`}
          placeholder="Password"
          value={user_password}
          onChangeText={setPassword}
          placeholderTextColor={tw.color('gray-400')}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={tw`absolute right-3 top-2.5`}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={tw`text-lg`}>{showPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>
      {error ? (
        <Text style={tw`text-red-500 mb-4 text-center`}>{error}</Text>
      ) : null}
      <TouchableOpacity
        style={tw`w-full bg-blue-500 py-3 rounded-md shadow-md`}
        onPress={handleLoginButtonPress}
        disabled={loading}
      >
        <Text style={tw`text-lg font-semibold text-white text-center`}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Log In'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`mt-4`}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={tw`text-blue-500 text-center`}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;