import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomePage from '../components/HomePage';
import UserPage from '../components/UserPage';
import ItemsPage from '../components/ItemsPage';

const DashboardPage = () => {
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();
  const navigate = useNavigate();

  const admin_name = location.state?.display_name;

  useEffect(() => {
    if (!admin_name) {
      console.warn("No admin name found in navigation state. Redirecting to login.");
      navigate('/login', { replace: true });
    }
  }, [admin_name, navigate]);

  if (!admin_name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Redirecting to login...</p>
      </div>
    );
  }

  // Function to render the appropriate content component based on activeSection state
  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return <HomePage />;
      case 'user':
        return <UserPage />;
      case 'items':
        return <ItemsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 font-inter">
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-3xl font-extrabold tracking-tight mb-4 sm:mb-0">
            Grocer App
          </div>

          <nav className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <div className="flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4">
              <button
                onClick={() => setActiveSection('home')}
                className={`py-2 px-4 rounded-md transition-all duration-200 text-sm sm:text-base ${activeSection === 'home' ? 'bg-blue-700 font-semibold shadow-md' : 'hover:bg-blue-700/50'
                  }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveSection('user')}
                className={`py-2 px-4 rounded-md transition-all duration-200 text-sm sm:text-base ${activeSection === 'user' ? 'bg-blue-700 font-semibold shadow-md' : 'hover:bg-blue-700/50'
                  }`}
              >
                User
              </button>
              <button
                onClick={() => setActiveSection('items')}
                className={`py-2 px-4 rounded-md transition-all duration-200 text-sm sm:text-base ${activeSection === 'items' ? 'bg-blue-700 font-semibold shadow-md' : 'hover:bg-blue-700/50'
                  }`}
              >
                Items
              </button>
            </div>

            <div className="flex items-center space-x-3 ml-0 sm:ml-6 mt-4 sm:mt-0">
              <span className="text-lg font-medium">{admin_name}</span>
              <button className="bg-blue-700 hover:bg-blue-900 text-white py-2 px-4 rounded-full transition-colors duration-200 shadow-md text-sm sm:text-base">
                Profile
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg my-8">
        {renderContent()}
      </main>

      <footer className="bg-gray-800 text-white text-center p-4 shadow-inner">
        <p className="text-sm sm:text-base">&copy; 2025 Created by [Akshay]</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
