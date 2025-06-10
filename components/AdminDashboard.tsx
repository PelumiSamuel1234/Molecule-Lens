
import React from 'react';
import type { SearchLog } from '../types';

interface AdminDashboardProps {
  logs: SearchLog[];
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ logs, onLogout }) => {
  const handleBackToMain = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.hash = ''; 
  };
  return (
    <div className="container mx-auto max-w-4xl mt-10 p-6 bg-white rounded-lg shadow-xl animate-fadeInUp">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-300 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-primary text-center sm:text-left">Admin Dashboard - Search Logs</h2>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      {logs.length === 0 ? (
        <p className="text-gray-600 text-center py-4">No search logs recorded yet.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Query</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">IP Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">City</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Region</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Country</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate" title={log.query}>{log.query}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.ip}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-8 text-center text-sm text-gray-500">
        <a href="#" onClick={handleBackToMain} className="text-brand-primary hover:underline">
          Back to Main App
        </a>
      </p>
    </div>
  );
};

export default AdminDashboard;