// utils/deleteItem.js
import { API_URL } from '@env';

export const deleteItem = async (itemId, setItemsToBuy, setItemsError, fetchItemsList) => {
    try {
        const response = await fetch(`${API_URL}/delete_item/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            if (fetchItemsList) {
                fetchItemsList();
            } else {
                setItemsToBuy(prevItems => prevItems.filter(item => item._id !== itemId && item.id !== itemId));
            }
        } else {
            setItemsError(data.message || `Failed to delete item. Status: ${response.status}`);
        }
    } catch (error) {
        setItemsError("Could not connect to the server to delete item.");
    }
};