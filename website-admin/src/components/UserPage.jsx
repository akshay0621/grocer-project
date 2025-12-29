import React, { useState, useEffect } from 'react';

const API_BACKEND = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  // New state to manage visibility for each user's password
  // Stores a Set of user IDs for whom the password should be visible
  const [visiblePasswordIds, setVisiblePasswordIds] = useState(new Set());

  // Helper function to format date as "26th May 2025"
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback to raw string if invalid

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    const getDaySuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    };

    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  // Function to fetch users from the backend using fetch
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BACKEND}/read_users`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handles deleting a single user
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BACKEND}/delete_user/${userId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        setUsers(users.filter((user) => user._id !== userId));
        setSelectedUserIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        // Also remove from visiblePasswordIds if deleted user's password was shown
        setVisiblePasswordIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
        alert('User deleted successfully!');
      } catch (err) {
        alert(err.message || 'Failed to delete user.');
      }
    }
  };

  // Handles selecting/deselecting individual user checkboxes
  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // Handles the "Select All" checkbox
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      const allUserIds = new Set(users.map((user) => user._id));
      setSelectedUserIds(allUserIds);
    } else {
      setSelectedUserIds(new Set());
    }
  };

  // Handles deleting all selected users
  const handleDeleteSelectedUsers = async () => {
    if (selectedUserIds.size === 0) {
      alert('No users selected for deletion.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedUserIds.size} selected user(s)? This action cannot be undone.`)) {
      setLoading(true);
      setError(null);

      const deletionPromises = Array.from(selectedUserIds).map(async (userId) => {
        try {
          const response = await fetch(`${API_BACKEND}/delete_user/${userId}`, {
            method: 'DELETE',
          });
          if (!response.ok) {
            const errorData = await response.json();
            return { userId, success: false, error: errorData.message || `HTTP error! status: ${response.status}` };
          }
          return { userId, success: true };
        } catch (err) {
          return { userId, success: false, error: err.message || 'Network error' };
        }
      });

      const results = await Promise.all(deletionPromises);
      const failedDeletions = results.filter(result => !result.success);

      if (failedDeletions.length > 0) {
        setError(`Failed to delete ${failedDeletions.length} user(s). Details: ${failedDeletions.map(f => f.error).join(', ')}`);
      } else {
        alert('Selected users deleted successfully!');
      }

      await fetchUsers();
      setSelectedUserIds(new Set());
      setVisiblePasswordIds(new Set()); // Clear any visible passwords after batch delete
      setLoading(false);
    }
  };

  // Determines if all users are selected for the "Select All" checkbox state
  const isAllSelected = users.length > 0 && selectedUserIds.size === users.length;

  // New function to toggle individual password visibility
  const handleTogglePasswordVisibility = (userId) => {
    setVisiblePasswordIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="p-6 text-gray-700 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Management</h2>
      <p className="text-gray-600 mb-6">
        Here you can view and manage all registered users. As an admin, you can delete user accounts.
      </p>

      {loading && (
        <div className="text-center text-blue-600 font-medium my-4">Loading users...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}

      {!loading && users.length === 0 && !error && (
        <div className="text-center text-gray-500 my-4">No users found.</div>
      )}

      {!loading && users.length > 0 && (
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
                    disabled={users.length === 0}
                  />
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Username</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Password</th> {/* No global toggle here */}
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Joining Date</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-600 uppercase tracking-wider rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      checked={selectedUserIds.has(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">{user.user_name}</td>
                  {/* Individual Password Cell with Toggle */}
                  <td className="relative py-3 px-4 border-b text-sm text-gray-800">
                    {visiblePasswordIds.has(user._id) ? user.user_password : '********'}
                    <button
                      onClick={() => handleTogglePasswordVisibility(user._id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={visiblePasswordIds.has(user._id) ? "Hide Password" : "Show Password"}
                    >
                      {visiblePasswordIds.has(user._id) ? (
                        // Eye-slash icon (hide)
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.774 3.162 10.066 7.5-.243.613-.541 1.189-.886 1.733M10.375 14.885c.826.575 1.815.917 2.86 0 1.15-.316 2.053-1.42 2.053-2.73 0-2.071-2.943-3.75-6.57-3.75S9.336 9.879 9.336 12c0 1.31.903 2.414 2.053 2.73zm-4.326-4.326L19.5 7.5m-7.5 7.5l-2.25-2.25" />
                        </svg>
                      ) : (
                        // Eye icon (show)
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.173.078.207.078.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.173ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 border-b text-sm text-gray-800">{formatDate(user.joining_date)}</td>
                  <td className="py-3 px-4 border-b">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded-md text-xs transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedUserIds.size > 0 && (
            <div className="mt-6 text-right">
              <button
                onClick={handleDeleteSelectedUsers}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50"
                disabled={selectedUserIds.size === 0 || loading}
              >
                Delete Selected ({selectedUserIds.size})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserPage;
