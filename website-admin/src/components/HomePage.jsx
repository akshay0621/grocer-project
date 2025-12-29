import React, { useState, useEffect } from 'react';

// Use a fallback to 'http://localhost:5000' for local development
const API_BACKEND = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const HomePage = () => {
  // State variables to store the counts and loading/error states
  const [userCount, setUserCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [userStats, setUserStats] = useState([]); // New state for individual user stats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch all dashboard data concurrently
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user count
        const usersResponse = await fetch(`${API_BACKEND}/count_users`);
        const usersData = await usersResponse.json();
        if (!usersResponse.ok) {
          throw new Error(usersData.error || `HTTP error! Status: ${usersResponse.status}`);
        }
        setUserCount(usersData.count);

        // Fetch item count
        const itemsResponse = await fetch(`${API_BACKEND}/count_items`);
        const itemsData = await itemsResponse.json();
        if (!itemsResponse.ok) {
          throw new Error(itemsData.error || `HTTP error! Status: ${itemsResponse.status}`);
        }
        setItemCount(itemsData.count);

        // --- NEW: Fetch detailed user statistics ---
        const statsResponse = await fetch(`${API_BACKEND}/user_statistics`);
        const statsData = await statsResponse.json();
        if (!statsResponse.ok) {
          throw new Error(statsData.error || `HTTP error! Status: ${statsResponse.status}`);
        }
        setUserStats(statsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="p-6 text-gray-700 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome to Your Grocer App Dashboard!</h2>
      <p className="text-gray-600">
        This is your central hub for managing family grocery lists and user access.
        Use the navigation links above to explore different sections.
      </p>

      {loading ? (
        <div className="text-center text-blue-600 font-medium my-8">Loading dashboard data...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-8" role="alert">
          <strong className="font-bold">Error:</strong> {error}
        </div>
      ) : (
        <>
          {/* Dashboard Overview - Same as before */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-blue-700 font-medium mb-4">Dashboard Overview:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Total Users</h3>
                <p className="text-4xl font-bold text-blue-600">{userCount}</p>
              </div>
              <div className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">Total Items</h3>
                <p className="text-4xl font-bold text-blue-600">{itemCount}</p>
              </div>
            </div>
          </div>

          {/* --- NEW: Individual User Statistics Section --- */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">User Activity Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {userStats.length > 0 ? (
                userStats.map((stats, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                    <h4 className="text-xl font-bold text-blue-700 mb-4">{stats.username}</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-500 text-2xl">🛒</span>
                        <p className="text-gray-600">
                          <span className="font-semibold">{stats.itemsAdded}</span> items added
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-500 text-2xl">✅</span>
                        <p className="text-gray-600">
                          <span className="font-semibold">{stats.itemsBought}</span> items bought
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full">No user activity data available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
