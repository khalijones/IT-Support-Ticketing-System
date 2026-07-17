import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-sm text-gray-500">Open Tickets</h2>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-sm text-gray-500">In Progress</h2>
          <div className="text-3xl font-bold">0</div>
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-sm text-gray-500">Resolved</h2>
          <div className="text-3xl font-bold">0</div>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link className="bg-blue-600 text-white px-4 py-2 rounded" to="/tickets">View Tickets</Link>
        <Link className="bg-gray-200 px-4 py-2 rounded" to="/knowledge">Knowledge Base</Link>
      </div>
    </div>
  );
};

export default Dashboard;
