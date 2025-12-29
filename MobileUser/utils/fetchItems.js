/**
 * Fetches items from the backend.
 *
 * @param {Function} setItemsToBuy - State setter for the items list.
 * @param {Function} setIsRefreshingItems - State setter for refresh indicator.
 * @param {Function} setItemsError - State setter for error messages.
 * @param {string} apiUrl - The base API URL from @env.
 */
export const fetchItems = async (setItemsToBuy, setIsRefreshingItems, setItemsError, apiUrl) => {
    setIsRefreshingItems(true);
    setItemsError('');

    try {
        const response = await fetch(`${apiUrl}/get_items/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            const rawText = await response.text();
            setItemsError(`Server responded with non-JSON: ${rawText.substring(0, 100)}...`);
            setIsRefreshingItems(false);
            return;
        }

        if (response.ok) {
            if (data && Array.isArray(data.items)) {
                setItemsToBuy(data.items);
            } else {
                setItemsError("Received malformed data from server. (Check console)");
                setItemsToBuy([]);
            }
        } else {
            setItemsError(data.message || `Failed to fetch items. Status: ${response.status}`);
        }
    } catch (error) {
        setItemsError("Could not connect to the server or fetch items.");
    } finally {
        setIsRefreshingItems(false);
    }
};