// components/AddFloatingButton.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const AddFloatingButton = ({ onPress }) => {
    return (
        <View style={tw`absolute bottom-10 right-6`}>
            <TouchableOpacity
                style={tw`bg-blue-500 p-4 rounded-full shadow-lg`}
                onPress={onPress}
            >
                <Text style={tw`text-white font-bold`}>Add Item</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AddFloatingButton;