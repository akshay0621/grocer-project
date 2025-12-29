// components/AddItemModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ActivityIndicator, ScrollView } from 'react-native';
import tw from 'twrnc';
import { API_URL } from '@env';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AddItemModal = ({ isVisible, onClose, onAddItem, onRefreshItems, loggedInUserName }) => {
    const [item_name, set_item_name] = useState('');
    const [item_quantity, set_item_quantity] = useState('');
    const [itemDescription, setItemDescription] = useState('');

    // Scheduling State
    const [scheduleType, setScheduleType] = useState('none'); // 'none', 'regular', 'specific'
    const [selectedDays, setSelectedDays] = useState([]);
    const [specificDate, setSpecificDate] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const getUpcomingDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 1; i <= 90; i++) {
            const nextDate = new Date();
            nextDate.setDate(today.getDate() + i);
            dates.push(nextDate);
        }
        return dates;
    };

    const handleSubmit = async () => {
        setError('');
        setIsSaving(true);

        if (!item_name || !item_quantity) {
            setError('Please enter item name and quantity.');
            setIsSaving(false);
            return;
        }

        if (scheduleType === 'regular' && selectedDays.length === 0) {
            setError('Please select at least one day.');
            setIsSaving(false);
            return;
        }

        if (scheduleType === 'specific' && !specificDate) {
            setError('Please select a future date.');
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/add_new_item`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item_name: item_name,
                    item_quantity: item_quantity,
                    added_by: loggedInUserName,
                    item_description: itemDescription,
                    schedule_type: scheduleType,
                    regular_days: scheduleType === 'regular' ? selectedDays : [],
                    specific_date: scheduleType === 'specific' ? specificDate : null,
                }),
            });

            if (response.ok) {
                resetForm();
                onRefreshItems();
                onClose();
            } else {
                const data = await response.json();
                setError(data.message || "Failed to add item.");
            }
        } catch (networkOrParsingError) {
            setError("Network error. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        set_item_name('');
        set_item_quantity('');
        setItemDescription('');
        setScheduleType('none');
        setSelectedDays([]);
        setSpecificDate(null);
        setError('');
    };

    useEffect(() => {
        if (!isVisible) resetForm();
    }, [isVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
                <View style={tw`w-11/12 bg-white p-6 rounded-3xl shadow-2xl`}>
                    <Text style={tw`text-2xl font-bold mb-4 text-gray-800`}>Add New Item</Text>

                    <TextInput
                        style={tw`w-full px-4 py-3 mb-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800`}
                        placeholder="Item Name (e.g., Milk)"
                        placeholderTextColor={tw.color('gray-400')}
                        value={item_name}
                        onChangeText={set_item_name}
                    />
                    <TextInput
                        style={tw`w-full px-4 py-3 mb-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800`}
                        placeholder="Quantity (e.g., 2 liters)"
                        placeholderTextColor={tw.color('gray-400')}
                        value={item_quantity}
                        onChangeText={set_item_quantity}
                    />
                    <TextInput
                        style={tw`w-full px-4 py-3 mb-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 h-16`}
                        placeholder="Description (Optional)"
                        placeholderTextColor={tw.color('gray-400')}
                        value={itemDescription}
                        onChangeText={setItemDescription}
                        multiline
                    />

                    {/* Schedule Selector */}
                    <Text style={tw`text-sm font-semibold text-gray-500 mb-2 uppercase tracking-tighter`}>Schedule Purchase</Text>
                    <View style={tw`flex-row mb-4`}>
                        <TouchableOpacity
                            onPress={() => setScheduleType(scheduleType === 'regular' ? 'none' : 'regular')}
                            style={tw`flex-1 mr-2 py-3 rounded-xl border-2 ${scheduleType === 'regular' ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-200'}`}
                        >
                            <Text style={tw`text-center font-bold ${scheduleType === 'regular' ? 'text-white' : 'text-gray-600'}`}>Regular</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setScheduleType(scheduleType === 'specific' ? 'none' : 'specific')}
                            style={tw`flex-1 py-3 rounded-xl border-2 ${scheduleType === 'specific' ? 'bg-purple-500 border-purple-500' : 'bg-white border-gray-200'}`}
                        >
                            <Text style={tw`text-center font-bold ${scheduleType === 'specific' ? 'text-white' : 'text-gray-600'}`}>Specific</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Regular Options */}
                    {scheduleType === 'regular' && (
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-xs text-gray-400 mb-2`}>Select days of the week:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                                {DAYS_OF_WEEK.map(day => (
                                    <TouchableOpacity
                                        key={day}
                                        onPress={() => toggleDay(day)}
                                        style={tw`mr-2 px-3 py-2 rounded-lg border ${selectedDays.includes(day) ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}
                                    >
                                        <Text style={tw`text-xs ${selectedDays.includes(day) ? 'text-blue-700 font-bold' : 'text-gray-500'}`}>{day.substring(0, 3)}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Specific Options */}
                    {scheduleType === 'specific' && (
                        <View style={tw`mb-4`}>
                            <Text style={tw`text-xs text-gray-400 mb-2`}>Select a future date:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`flex-row`}>
                                {getUpcomingDates().map(date => {
                                    const isSelected = specificDate && specificDate.toDateString() === date.toDateString();
                                    return (
                                        <TouchableOpacity
                                            key={date.toISOString()}
                                            onPress={() => setSpecificDate(date)}
                                            style={tw`mr-2 px-4 py-2 rounded-lg border items-center ${isSelected ? 'bg-purple-100 border-purple-500' : 'bg-white border-gray-200'}`}
                                        >
                                            <Text style={tw`text-[10px] uppercase font-bold ${isSelected ? 'text-purple-700' : 'text-gray-400'}`}>{date.toLocaleString('default', { month: 'short' })}</Text>
                                            <Text style={tw`text-lg font-bold ${isSelected ? 'text-purple-700' : 'text-gray-700'}`}>{date.getDate()}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    )}

                    {error ? <Text style={tw`text-red-500 mb-3 text-center text-sm`}>{error}</Text> : null}

                    <TouchableOpacity
                        style={tw`w-full bg-blue-600 py-4 rounded-xl shadow-lg mb-3`}
                        onPress={handleSubmit}
                        disabled={isSaving}
                    >
                        <Text style={tw`text-lg font-bold text-white text-center`}>
                            {isSaving ? <ActivityIndicator color="#fff" /> : 'Save Item'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onClose} disabled={isSaving}>
                        <Text style={tw`text-gray-400 text-center font-semibold`}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default AddItemModal;