import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Lock } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate authentication with hardcoded users
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'admin');
      localStorage.setItem('username', 'Admin');
      navigate('/'); // Redirect to admin dashboard
    } else if (credentials.username === 'hayyan' && credentials.password === 'user123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'user');
      localStorage.setItem('userId', '2');
      localStorage.setItem('username', 'Hayyan Mohamed');
      navigate('/user/2'); // Redirect to user-specific page
    } else if (credentials.username === 'loubna' && credentials.password === 'user225') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', 'user');
      localStorage.setItem('userId', '3');
      localStorage.setItem('username', 'Loubna Chalkhane');
      navigate('/user/3'); // Redirect to user-specific page
    } else {
      alert('Identifiants invalides'); // Show error for invalid credentials
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center"
      style={{
        backgroundImage: "url('https://www.actemium.in/app/uploads/sites/339/2023/08/featured-image-actemium-2.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <Factory className="w-10 h-10 text-blue-500" />
          <h1 className="text-2xl font-bold ml-2">
            <span className="text-blue-500">Factory</span>
            <span className="text-green-500">EYE</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Lock className="w-4 h-4 mr-2" />
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;