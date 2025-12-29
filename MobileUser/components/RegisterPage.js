import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { API_URL } from '@env';

const RegisterPage = ({ navigation }) => {
  const [user_name, set_user_name] = useState('');
  const [user_password, set_user_password] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!user_name || !user_password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user_register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name, user_password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        Alert.alert(
          "Success",
          "Registration successful! Please login.",
          [
            { text: "OK", onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        console.error('Registration failed:', data);
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setError('Failed to connect to the server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-4`}>
      <Text style={tw`text-3xl font-bold mb-6 text-blue-600`}>Register</Text>
      <TextInput
        style={tw`w-full px-4 py-2 mb-4 border border-gray-300 rounded-md text-gray-800`}
        placeholder="User Name"
        value={user_name}
        onChangeText={set_user_name}
        placeholderTextColor={tw.color('gray-400')}
        autoCapitalize="none"
      />
      <View style={tw`w-full relative mb-6`}>
        <TextInput
          style={tw`w-full px-4 py-2 border border-gray-300 rounded-md text-gray-800`}
          placeholder="Password"
          value={user_password}
          onChangeText={set_user_password}
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
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={tw`text-lg font-semibold text-white text-center`}>
          {loading ? <ActivityIndicator color="#fff" /> : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`mt-4`}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={tw`text-blue-500 text-center`}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterPage;