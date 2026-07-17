import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const TicketDetail = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get(`/tickets/${id}`);
      setTicket(response.data);
    };
    load();
  }, [id]);

  if (!ticket) return <div className="p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>
      <div className="bg-white rounded shadow p-6 space-y-3">
        <p><strong>Status:</strong> {ticket.status}</p>
        <p><strong>Priority:</strong> {ticket.priority}</p>
        <p><strong>Description:</strong> {ticket.description}</p>
      </div>
    </div>
  );
};

export default TicketDetail;
