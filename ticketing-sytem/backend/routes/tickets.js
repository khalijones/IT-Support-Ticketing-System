const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const ticketController = require('../controllers/ticketController');

router.post('/', auth, ticketController.createTicket);
router.get('/', auth, ticketController.getTickets);
router.get('/:id', auth, ticketController.getTicketById);
router.put('/:id', auth, ticketController.updateTicket);
router.post('/:id/messages', auth, ticketController.addMessage);
router.delete('/:id', auth, checkRole(['admin', 'agent']), ticketController.deleteTicket);

module.exports = router;