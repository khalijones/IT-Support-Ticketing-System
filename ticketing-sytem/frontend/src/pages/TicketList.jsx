import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const response = await api.get('/tickets');
    setTickets(response.data);
  };

  const getStatusColor = (status) => {
    const colors = {
      'open': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': 'text-red-600 font-bold',
      'high': 'text-orange-600 font-semibold',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const isOverdue = (ticket) => {
    return new Date(ticket.slaDeadline) < new Date() && 
           !['resolved', 'closed'].includes(ticket.status);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tickets</h1>
        <button 
          onClick={() => window.location.href='/tickets/new'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Ticket
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        {['all', 'open', 'in-progress', 'resolved'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded ${filter === status ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SLA Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets
              .filter(t => filter === 'all' || t.status === filter)
              .map(ticket => (
              <tr key={ticket._id} className="hover:bg-gray-50 cursor-pointer" 
                  onClick={() => window.location.href=`/tickets/${ticket._id}`}>
                <td className="px-6 py-4 whitespace-nowrap">#{ticket._id.slice(-6)}</td>
                <td className="px-6 py-4">{ticket.title}</td>
                <td className={`px-6 py-4 ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority.toUpperCase()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  {isOverdue(ticket) && (
                    <span className="ml-2 text-red-600 text-xs font-bold">OVERDUE</span>
                  )}
                </td>
                <td className={`px-6 py-4 ${isOverdue(ticket) ? 'text-red-600 font-bold' : ''}`}>
                  {new Date(ticket.slaDeadline).toLocaleString()}
                </td>
                <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;