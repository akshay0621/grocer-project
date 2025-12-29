// utils/boughtItem.js
import { API_URL } from '@env';

export const boughtItem = async (itemId, setItemsToBuy, setItemsError, fetchItemsList, loggedInUserName) => {
    try {
        const response = await fetch(`${API_URL}/mark_item_bought/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ is_purchased: true, purchased_by: loggedInUserName })
        });

        const data = await response.json();

        if (response.ok) {
            if (fetchItemsList) {
                fetchItemsList();
            } else {
                setItemsToBuy(prevItems => prevItems.filter(item => item._id !== itemId && item.id !== itemId));
            }
        } else {
            setItemsError(data.message || `Failed to mark item as bought. Status: ${response.status}`);
        }
    } catch (error) {
        setItemsError("Could not connect to the server to mark item as bought.");
    }
};