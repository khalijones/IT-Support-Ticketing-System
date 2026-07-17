const Ticket = require('../models/Tickets');
const User = require('../models/User');

// SLA Configuration (in hours)
const SLA_CONFIG = {
  critical: { response: 1, resolution: 4 },
  high: { response: 4, resolution: 24 },
  medium: { response: 8, resolution: 48 },
  low: { response: 24, resolution: 72 }
};

exports.createTicket = async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    const sla = SLA_CONFIG[priority] || SLA_CONFIG.medium;
    
    const ticket = new Ticket({
      title,
      description,
      priority,
      category,
      createdBy: req.user.id,
      slaDeadline: new Date(Date.now() + sla.resolution * 60 * 60 * 1000),
      responseTime: { target: sla.response },
      resolutionTime: { target: sla.resolution }
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.createdBy = req.user.id;
    } else if (req.user.role === 'agent') {
      query.assignedTo = req.user.id;
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');
    
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const updateData = { ...req.body };
    
    if (status === 'resolved' || status === 'closed') {
      const ticket = await Ticket.findById(req.params.id);
      const resolutionHours = (new Date() - ticket.createdAt) / (1000 * 60 * 60);
      updateData.resolutionTime = { 
        ...ticket.resolutionTime, 
        actual: resolutionHours 
      };
    }

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.messages.push({
      author: req.user.id,
      content
    });

    // Track response time on first message from agent
    if (ticket.messages.length === 1 && req.user.role !== 'user') {
      const responseHours = (new Date() - ticket.createdAt) / (1000 * 60 * 60);
      ticket.responseTime.actual = responseHours;
    }

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};