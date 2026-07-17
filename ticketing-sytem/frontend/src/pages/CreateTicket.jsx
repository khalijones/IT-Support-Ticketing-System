import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/tickets', form);
    navigate('/tickets');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Ticket</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-4 max-w-2xl">
        <input className="w-full border rounded px-3 py-2" name="title" placeholder="Title" onChange={handleChange} />
        <textarea className="w-full border rounded px-3 py-2" name="description" placeholder="Description" onChange={handleChange} />
        <select className="w-full border rounded px-3 py-2" name="priority" value={form.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input className="w-full border rounded px-3 py-2" name="category" placeholder="Category" onChange={handleChange} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default CreateTicket;
