// components/ItemCard.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

const ItemCard = ({ item, onBought, onDelete, loggedInUserName }) => {
    if (!item) {
        return null;
    }

    const itemName = String(item.item_name || 'N/A Item Name');
    const itemQuantity = String(item.item_quantity || 'N/A Quantity');
    const addedBy = String(item.added_by || 'Unknown');
    const itemDescription = String(item.item_description || 'No description provided');

    const isNotOwner = loggedInUserName !== addedBy;

    return (
        <View style={tw`bg-white p-4 my-2 rounded-lg shadow-md`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
                <View style={tw`flex-1 mr-4`}>
                    <Text style={tw`text-lg font-bold text-gray-800`}>
                        {itemName} <Text style={tw`font-normal text-base text-gray-700`}>({itemQuantity})</Text>
                    </Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        Added by: {isNotOwner ? addedBy : "You"}
                    </Text>
                    <Text style={tw`text-xs text-gray-500 mt-1`}>
                        Description: {itemDescription}
                    </Text>

                    {item.schedule_type === 'regular' && item.regular_days?.length > 0 && (
                        <View style={tw`bg-blue-50 px-2 py-1 rounded mt-2 self-start border border-blue-100`}>
                            <Text style={tw`text-[10px] text-blue-600 font-bold uppercase`}>
                                Repeats on: {item.regular_days.join(', ')}
                            </Text>
                        </View>
                    )}

                    {item.schedule_type === 'specific' && item.specific_date && (
                        <View style={tw`bg-purple-50 px-2 py-1 rounded mt-2 self-start border border-purple-100`}>
                            <Text style={tw`text-[10px] text-purple-600 font-bold uppercase`}>
                                Planned for: {new Date(item.specific_date).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={tw`flex-col items-center justify-center`}>
                    <TouchableOpacity
                        style={tw`bg-green-500 px-4 py-2 rounded-md shadow mb-2`}
                        onPress={() => onBought(item._id || item.id)}
                    >
                        <Text style={tw`text-white font-semibold`}>✔</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={tw`bg-red-500 px-4 py-2 rounded-md shadow ${isNotOwner ? 'opacity-50' : ''}`}
                        onPress={() => onDelete(item._id || item.id)}
                        disabled={isNotOwner}
                    >
                        <Text style={tw`text-white font-semibold`}>✖</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ItemCard;