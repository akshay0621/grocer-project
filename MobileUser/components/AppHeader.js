// components/AppHeader.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

const AppHeader = ({ onProfilePress, onHistoryPress, onRefresh, isRefreshing }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOptionPress = (callback) => {
        setMenuOpen(false);
        callback();
    };

    return (
        <View style={tw`bg-blue-600 z-50`}>
            <View style={tw`flex-row justify-between items-center p-4 pt-10`}>
                <Text style={tw`text-white text-2xl font-bold`}>Grocer</Text>

                <View style={tw`flex-row items-center`}>
                    <TouchableOpacity
                        style={tw`mr-4`}
                        onPress={onRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text style={tw`text-white text-2xl font-bold`}>↻</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`px-2`}
                        onPress={() => setMenuOpen(!menuOpen)}
                    >
                        <Text style={tw`text-white text-3xl font-bold`}>☰</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {menuOpen && (
                <View style={tw`absolute top-22 right-4 bg-white rounded-lg shadow-xl w-40 overflow-hidden z-50`}>
                    <TouchableOpacity
                        style={tw`p-4 border-b border-gray-100`}
                        onPress={() => handleOptionPress(onProfilePress)}
                    >
                        <Text style={tw`text-gray-800 font-semibold`}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`p-4`}
                        onPress={() => handleOptionPress(onHistoryPress)}
                    >
                        <Text style={tw`text-gray-800 font-semibold`}>History</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default AppHeader;