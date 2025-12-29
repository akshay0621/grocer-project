import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const API_BACKEND = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
    const [admin_name, setName] = useState('');
    const [admin_password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setMessage('');
        setError(null);
        setLoading(true);

        if (!admin_name.trim() || !admin_password.trim()) {
            setError('Name and password required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BACKEND}/admin_register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_name, admin_password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setName('');
                setPassword('');
                navigate('/login');
            } else {
                setError(data.error || 'Registration failed.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
                <h2 className="text-center font-bold text-2xl text-gray-800">Register</h2>
                <p className="text-center text-gray-600 text-sm">Create an account</p>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md flex items-start gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-5 w-5 flex-shrink-0"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <div>
                            <strong className="font-semibold">Error!</strong> {error}
                        </div>
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-md">
                        <strong className="font-semibold">Success!</strong> {message}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your name"
                            value={admin_name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            disabled={loading}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Your password"
                            value={admin_password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-500 text-white py-2.5 px-4 rounded-md cursor-pointer border-none text-base font-semibold hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </div>
        </div>
    );
};

export default Register;