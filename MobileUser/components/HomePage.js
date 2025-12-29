// HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tw from 'twrnc';
import { fetchItems } from '../utils/fetchItems';
import { boughtItem } from '../utils/boughtItem';
import { deleteItem } from '../utils/deleteItem';
import AppHeader from './AppHeader';
import ItemsListSection from './ItemsListSection';
import AddFloatingButton from './AddFloatingButton';
import AddItemModal from './AddItemModal'; // Assuming this was a typo in your code earlier, should be AddItemModal
import { API_URL } from '@env';

const HomePage = ({ navigation, route }) => {
    const [isAddItemModalVisible, setAddItemModalVisible] = useState(false);
    const [loggedInUserName, setLoggedInUserName] = useState('');
    const [isRefreshingItems, setIsRefreshingItems] = useState(false);
    const [itemsToBuy, setItemsToBuy] = useState([]);
    const [itemsError, setItemsError] = useState('');

    useEffect(() => {
        const initializeUser = async () => {
            if (route.params?.loggedInUserName) {
                setLoggedInUserName(route.params.loggedInUserName);
            } else {
                const storedUsername = await AsyncStorage.getItem('savedUsername');
                if (storedUsername) {
                    setLoggedInUserName(storedUsername);
                } else {
                    navigation.navigate('Login');
                }
            }
        };
        initializeUser();
    }, [route.params?.loggedInUserName, navigation]);

    const navigateToProfile = () => {
        navigation.navigate('Profile', { userName: loggedInUserName });
    };

    const navigateToHistory = () => {
        navigation.navigate('History', { loggedInUserName: loggedInUserName });
    };

    const fetchItemsList = useCallback(async () => {
        await fetchItems(
            setItemsToBuy,
            setIsRefreshingItems,
            setItemsError,
            API_URL
        );
    }, [setItemsToBuy, setIsRefreshingItems, setItemsError, API_URL]);

    useEffect(() => {
        if (loggedInUserName) {
            fetchItemsList();
        }
    }, [fetchItemsList, loggedInUserName]);

    const handleBought = useCallback(
        (itemId) => {
            boughtItem(itemId, setItemsToBuy, setItemsError, fetchItemsList, loggedInUserName);
        },
        [setItemsToBuy, setItemsError, fetchItemsList, loggedInUserName]
    );

    const handleDeleteItem = useCallback(
        (itemId) => {
            deleteItem(itemId, setItemsToBuy, setItemsError, fetchItemsList);
        },
        [setItemsToBuy, setItemsError, fetchItemsList]
    );

    const handleAddItemFromModal = (newItem) => {
        setItemsToBuy((prevItems) => [...prevItems, newItem]);
        fetchItemsList(); // This is already called by onRefreshItems from the modal if successful
    };

    const [activeSection, setActiveSection] = useState('Buy'); // 'Buy' or 'Future'
    const [expandedFutureSection, setExpandedFutureSection] = useState(null); // null, 'regular', 'specific'
    const [regularItems, setRegularItems] = useState([]);
    const [specificItems, setSpecificItems] = useState([]);
    const [isFetchingFuture, setIsFetchingFuture] = useState(false);

    const fetchFutureItems = useCallback(async (type) => {
        if (!type) return;
        setIsFetchingFuture(true);
        try {
            const response = await fetch(`${API_URL}/get_future_items?type=${type}`);
            const data = await response.json();
            if (response.ok) {
                if (type === 'regular') setRegularItems(data.items);
                else setSpecificItems(data.items);
            } else {
                setItemsError(data.error || "Failed to fetch future items");
            }
        } catch (err) {
            setItemsError("Network error fetching future items");
        } finally {
            setIsFetchingFuture(false);
        }
    }, [API_URL]);

    const handleToggleFutureSection = (type) => {
        if (expandedFutureSection === type) {
            setExpandedFutureSection(null);
        } else {
            setExpandedFutureSection(type);
            fetchFutureItems(type);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            <AppHeader
                onProfilePress={navigateToProfile}
                onHistoryPress={navigateToHistory}
                onRefresh={activeSection === 'Buy' ? fetchItemsList : () => fetchFutureItems(expandedFutureSection)}
                isRefreshing={isRefreshingItems || isFetchingFuture}
            />

            {/* Section Toggles */}
            <View style={tw`flex-row bg-blue-600 px-4 pb-4`}>
                <TouchableOpacity
                    onPress={() => setActiveSection('Buy')}
                    style={tw`flex-1 py-2 ${activeSection === 'Buy' ? 'border-b-4 border-white' : ''}`}
                >
                    <Text style={tw`text-white text-center font-bold text-lg`}>Buy Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setActiveSection('Future')}
                    style={tw`flex-1 py-2 ${activeSection === 'Future' ? 'border-b-4 border-white' : ''}`}
                >
                    <Text style={tw`text-white text-center font-bold text-lg`}>Scheduled Items</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`flex-1`}>
                {loggedInUserName ? (
                    <>
                        {activeSection === 'Buy' ? (
                            <ItemsListSection
                                itemsToBuy={itemsToBuy}
                                isRefreshingItems={isRefreshingItems}
                                itemsError={itemsError}
                                onRefreshItems={fetchItemsList}
                                onItemBought={handleBought}
                                onItemDelete={handleDeleteItem}
                                loggedInUserName={loggedInUserName}
                            />
                        ) : (
                            <ScrollView style={tw`flex-1 p-4`}>
                                {/* Regular Section */}
                                <TouchableOpacity
                                    style={tw`bg-white w-full py-5 rounded-xl shadow-md mb-4 border-l-8 border-blue-500`}
                                    onPress={() => handleToggleFutureSection('regular')}
                                >
                                    <Text style={tw`text-xl font-bold text-gray-800 text-center`}>Regular</Text>
                                    <Text style={tw`text-gray-500 text-center text-xs mt-1`}>Items you buy frequently</Text>
                                </TouchableOpacity>

                                {expandedFutureSection === 'regular' && (
                                    <View style={tw`w-full mb-8`}>
                                        <ItemsListSection
                                            itemsToBuy={regularItems}
                                            isRefreshingItems={isFetchingFuture}
                                            itemsError={itemsError}
                                            onRefreshItems={() => fetchFutureItems('regular')}
                                            onItemBought={handleBought}
                                            onItemDelete={handleDeleteItem}
                                            loggedInUserName={loggedInUserName}
                                        />
                                    </View>
                                )}

                                {/* Specific Section */}
                                <TouchableOpacity
                                    style={tw`bg-white w-full py-5 rounded-xl shadow-md border-l-8 border-purple-500`}
                                    onPress={() => handleToggleFutureSection('specific')}
                                >
                                    <Text style={tw`text-xl font-bold text-gray-800 text-center`}>Specific</Text>
                                    <Text style={tw`text-gray-500 text-center text-xs mt-1`}>One-time future items</Text>
                                </TouchableOpacity>

                                {expandedFutureSection === 'specific' && (
                                    <View style={tw`w-full mt-4 mb-20`}>
                                        <ItemsListSection
                                            itemsToBuy={specificItems}
                                            isRefreshingItems={isFetchingFuture}
                                            itemsError={itemsError}
                                            onRefreshItems={() => fetchFutureItems('specific')}
                                            onItemBought={handleBought}
                                            onItemDelete={handleDeleteItem}
                                            loggedInUserName={loggedInUserName}
                                        />
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </>
                ) : (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size="large" color={tw.color('blue-600')} />
                        <Text style={tw`mt-4 text-gray-700`}>Loading user data...</Text>
                    </View>
                )}
            </View>

            {loggedInUserName && (
                <AddFloatingButton onPress={() => setAddItemModalVisible(true)} />
            )}

            <AddItemModal
                isVisible={isAddItemModalVisible}
                onClose={() => setAddItemModalVisible(false)}
                onAddItem={handleAddItemFromModal}
                onRefreshItems={fetchItemsList}
                loggedInUserName={loggedInUserName}
            />
        </View>
    );
};

export default HomePage;