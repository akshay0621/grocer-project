// components/HistoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, SafeAreaView } from 'react-native';
import tw from 'twrnc';
import { API_URL } from '@env';
import ItemCard from './ItemCard';

const HistoryPage = ({ navigation, route }) => {
    const [historyItems, setHistoryItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [addingItemId, setAddingItemId] = useState(null);
    const loggedInUserName = route.params?.loggedInUserName || 'User';

    const handleReAdd = async (item) => {
        setAddingItemId(item._id);
        try {
            const response = await fetch(`${API_URL}/add_new_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_name: item.item_name,
                    item_quantity: item.item_quantity,
                    added_by: loggedInUserName,
                    item_description: item.item_description || '',
                    schedule_type: 'none'
                }),
            });

            if (response.ok) {
                alert(`${item.item_name} added back to list!`);
            } else {
                alert('Failed to re-add item.');
            }
        } catch (err) {
            alert('Network error.');
        } finally {
            setAddingItemId(null);
        }
    };

    const fetchHistory = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            // Fetching items where is_purchased is true
            const response = await fetch(`${API_URL}/get_all_items`);
            const data = await response.json();

            if (response.ok) {
                // Filter for purchased items only
                const purchased = data.items.filter(item => item.is_purchased === true);
                // Sort by updatedAt (descending) to show recent first
                purchased.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setHistoryItems(purchased);
            } else {
                setError(data.error || 'Failed to fetch history');
            }
        } catch (err) {
            setError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-100`}>
            {/* Header */}
            <View style={tw`flex-row items-center bg-blue-600 p-4 pt-10`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
                    <Text style={tw`text-white text-2xl font-bold`}>←</Text>
                </TouchableOpacity>
                <Text style={tw`text-white text-2xl font-bold`}>Purchase History</Text>
            </View>

            <View style={tw`flex-1 p-4`}>
                {isLoading ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color={tw.color('blue-600')} />
                        <Text style={tw`mt-4 text-gray-600`}>Loading history...</Text>
                    </View>
                ) : error ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Text style={tw`text-red-500 mb-4`}>{error}</Text>
                        <TouchableOpacity
                            style={tw`bg-blue-600 px-6 py-2 rounded-lg`}
                            onPress={fetchHistory}
                        >
                            <Text style={tw`text-white font-bold`}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : historyItems.length > 0 ? (
                    <FlatList
                        data={historyItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={tw`bg-white p-4 my-2 rounded-xl shadow-sm border-l-8 border-green-500 flex-row justify-between items-center`}>
                                <View style={tw`flex-1 mr-4`}>
                                    <Text style={tw`text-lg font-bold text-gray-800`}>{item.item_name}</Text>
                                    <Text style={tw`text-gray-600 text-sm`}>Quantity: {item.item_quantity}</Text>
                                    <Text style={tw`text-[10px] text-gray-400 mt-2`}>
                                        Bought {new Date(item.updatedAt).toLocaleDateString()} by {item.purchased_by || 'Unknown'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={tw`bg-blue-500 px-4 py-2 rounded-lg shadow-sm`}
                                    onPress={() => handleReAdd(item)}
                                    disabled={addingItemId === item._id}
                                >
                                    {addingItemId === item._id ? (
                                        <ActivityIndicator color="white" size="small" />
                                    ) : (
                                        <Text style={tw`text-white font-bold text-xs`}>+ Add Again</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                        contentContainerStyle={tw`pb-20`}
                    />
                ) : (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Text style={tw`text-gray-500 text-lg`}>No history found.</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default HistoryPage;
