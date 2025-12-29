// ItemsListSection.js
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import tw from 'twrnc';
import ItemCard from './ItemCard';

const ItemsListSection = ({
    itemsToBuy,
    isRefreshingItems,
    itemsError,
    onRefreshItems,
    onItemBought,
    onItemDelete,
    loggedInUserName,
    // Note: The previous interaction added 'sectionType' and 'onAddAgain'
    // but based on your provided ItemCard and your instruction "Only make changes to implement the modify function"
    // I am assuming we are reverting to the state prior to the Buy/History section work for this specific request.
    // If you need the Buy/History functionality combined with Update, please clarify.
}) => {
    return (
        <View style={tw`flex-1`}>

            {itemsError ? (
                <Text style={tw`text-red-500 text-center mb-4`}>{itemsError}</Text>
            ) : null}

            {itemsToBuy.length > 0 ? (
                <FlatList
                    data={itemsToBuy}
                    keyExtractor={(item) => {
                        const key = item._id || item.id;
                        if (key === undefined || key === null) {
                            return `no-id-${Math.random()}`;
                        }
                        return key;
                    }}
                    renderItem={({ item }) => (
                        <ItemCard
                            item={item}
                            onBought={onItemBought}
                            onDelete={onItemDelete}
                            loggedInUserName={loggedInUserName}
                        />
                    )}
                    contentContainerStyle={tw`pb-24`}
                />
            ) : (
                <View style={tw`bg-white p-4 rounded-lg shadow`}>
                    {isRefreshingItems ? (
                        <ActivityIndicator size="large" color={tw.color('blue-500')} />
                    ) : (
                        <Text style={tw`text-gray-600 text-center`}>
                            {itemsError ? "Failed to load items." : "No items in the list. Add one!"}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
};

export default ItemsListSection;