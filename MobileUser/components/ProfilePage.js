// components/ProfilePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { API_URL } from '@env';

const ProfilePage = ({ route, navigation }) => {
    const [userName, setUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChanging, setIsChanging] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (route.params?.userName) {
            setUserName(String(route.params.userName));
        } else {
            setUserName('Guest');
        }
    }, [route.params?.userName]);

    const handleLogout = useCallback(async () => {
        await AsyncStorage.removeItem('savedUsername');
        await AsyncStorage.removeItem('savedPassword');
        navigation.replace('Login');
    }, [navigation]);

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError('Please fill in both fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 4) {
            setError('New password must be at least 4 characters.');
            return;
        }

        setIsChanging(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/change_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_name: userName,
                    new_password: newPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password changed successfully! Please login again.');
                handleLogout();
            } else {
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsChanging(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            <ScrollView contentContainerStyle={tw`flex-grow p-4`}>
                {/* Back button */}
                <TouchableOpacity
                    style={tw`mt-4 mb-8 bg-white p-3 rounded-xl shadow-sm self-start`}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={tw`text-gray-800 font-bold`}>← Back</Text>
                </TouchableOpacity>

                {/* Profile Information */}
                <View style={tw`items-center mb-10`}>
                    <View style={tw`w-20 h-20 bg-blue-600 rounded-full justify-center items-center mb-4`}>
                        <Text style={tw`text-white text-3xl font-bold uppercase`}>{userName.charAt(0)}</Text>
                    </View>
                    <Text style={tw`text-3xl font-bold text-gray-800`}>{userName}</Text>
                    <Text style={tw`text-gray-500 mt-1`}>Family Member</Text>
                </View>

                {/* Change Password Form */}
                <View style={tw`bg-white p-6 rounded-3xl shadow-lg border border-gray-100`}>
                    <Text style={tw`text-xl font-bold text-gray-800 mb-6`}>Update Password</Text>

                    <View style={tw`mb-4`}>
                        <Text style={tw`text-gray-600 mb-2 font-semibold ml-1`}>New Password</Text>
                        <TextInput
                            style={tw`bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800`}
                            placeholder="Min. 4 characters"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                    </View>

                    <View style={tw`mb-6`}>
                        <Text style={tw`text-gray-600 mb-2 font-semibold ml-1`}>Confirm New Password</Text>
                        <TextInput
                            style={tw`bg-gray-50 border border-gray-200 p-4 rounded-xl text-gray-800`}
                            placeholder="Re-enter new password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>

                    {error ? <Text style={tw`text-red-500 mb-4 text-center text-sm font-medium`}>{error}</Text> : null}

                    <TouchableOpacity
                        style={tw`w-full bg-blue-600 py-4 rounded-xl shadow-md`}
                        onPress={handleChangePassword}
                        disabled={isChanging}
                    >
                        {isChanging ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={tw`text-lg font-bold text-white text-center`}>Change Password</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={tw`flex-1`} />

                {/* Logout Button */}
                <TouchableOpacity
                    style={tw`w-full bg-red-100 py-4 rounded-xl border border-red-200 mt-10 mb-8`}
                    onPress={handleLogout}
                >
                    <Text style={tw`text-lg font-bold text-red-600 text-center`}>Sign Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfilePage;