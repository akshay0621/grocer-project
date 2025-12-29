import React, { useState, useEffect } from 'react';

// Define your backend API base URL
// Use a fallback to 'http://localhost:5000' if REACT_APP_API_BASE_URL is not set
const API_BACKEND = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State to store IDs of selected items for batch operations
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BACKEND}/get_all_items`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items due to an unknown error.');
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  // Handles deleting a single item
  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BACKEND}/delete_item/${itemId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        // Update the UI by filtering out the deleted item
        setItems(items.filter((item) => item._id !== itemId));
        // Also remove from selected IDs if it was selected
        setSelectedItemIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        alert('Item deleted successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete item.');
      }
    }
  };

  // Handles selecting/deselecting individual item checkboxes
  const handleCheckboxChange = (itemId) => {
    setSelectedItemIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handles the "Select All" checkbox
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allItemIds = new Set(items.map((item) => item._id));
      setSelectedItemIds(allItemIds);
    } else {
      setSelectedItemIds(new Set());
    }
  };

  // Handles deleting all selected items
  const handleDeleteSelectedItems = async () => {
    if (selectedItemIds.size === 0) {
      alert('No items selected for deletion.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedItemIds.size} selected item(s)? This action cannot be undone.`)) {
      setLoading(true);
      setError(null);

      const deletionPromises = Array.from(selectedItemIds).map(async (itemId) => {
        try {
          const response = await fetch(`${API_BACKEND}/delete_item/${itemId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            const errorData = await response.json();
            return { itemId, success: false, error: errorData.message || `HTTP error! status: ${response.status}` };
          }
          return { itemId, success: true };
        } catch (err) {
          return { itemId, success: false, error: err.message || 'Network error' };
        }
      });

      const results = await Promise.all(deletionPromises);
      const failedDeletions = results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        setError(`Failed to delete ${failedDeletions.length} item(s). Details: ${failedDeletions.map(f => f.error).join(', ')}`);
      } else {
        alert('Selected items deleted successfully!');
      }

      // Re-fetch the item list to get the most current state after deletions
      await fetchItems();
      setSelectedItemIds(new Set()); // Clear selections after attempt
      setLoading(false);
    }
  };

  // Determines if all items are selected for the "Select All" checkbox state
  const isAllSelected = items.length > 0 && selectedItemIds.size === items.length;


  return (
    <div className="p-6 text-gray-700 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Grocery Items Management</h2>
      <p className="text-gray-600 mb-6">
        Here you can view all grocery items.
      </p>

      {loading && (
        <div className="text-center text-blue-600 font-medium my-4">Loading items...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="text-center text-gray-500 my-4">No items found.</div>
      )}

      {!loading && items.length > 0 && (
        <>
          <p className="mb-4 text-gray-700">Total number of items: <span className="font-semibold">{items.length}</span></p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tl-lg">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      onChange={handleSelectAllChange}
                      checked={isAllSelected}
                      disabled={items.length === 0}
                    />
                  </th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Item Name</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Added By</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Purchased?</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Purchased By</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600 rounded"
                        checked={selectedItemIds.has(item._id)}
                        onChange={() => handleCheckboxChange(item._id)}
                      />
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">{item.item_name}</td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">{item.item_quantity}</td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">{item.added_by}</td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">{item.item_description}</td>
                    <td className="py-3 px-4 border-b text-center">
                      {item.is_purchased ? 'Yes' : 'No'}
                    </td>
                    <td className="py-3 px-4 border-b text-sm text-gray-800">
                      {item.is_purchased ? (item.purchased_by || 'N/A') : 'Not yet'}
                    </td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-md text-xs transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedItemIds.size > 0 && (
            <div className="mt-6 text-right">
              <button
                onClick={handleDeleteSelectedItems}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={selectedItemIds.size === 0 || loading}
              >
                Delete Selected ({selectedItemIds.size})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemsPage;
