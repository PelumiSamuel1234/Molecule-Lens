
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    if (username === 'root' && password === 'root') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleBackToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = ''; 
  };

  return (
    <div className="container mx-auto max-w-md mt-20 p-8 bg-white rounded-lg shadow-xl animate-fadeInUp">
      <h2 className="text-3xl font-bold text-brand-primary text-center mb-8">Admin Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username" // for accessibility and form handling
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            required
            aria-required="true"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password" // for accessibility and form handling
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
            required
            aria-required="true"
            autoComplete="current-password"
          />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            Login
          </button>
        </div>
      </form>
       <p className="mt-6 text-center text-sm text-gray-500">
        <a href="#" onClick={handleBackToMain} className="text-brand-primary hover:underline">
          Back to Main App
        </a>
      </p>
    </div>
  );
};

export default AdminLogin;