const express = require('express');
const router = express.Router();
const KnowledgeBase = require('../models/KnowledgeBase');
const { auth, checkRole } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const articles = await KnowledgeBase.find().sort('-createdAt');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, checkRole(['admin', 'agent']), async (req, res) => {
  try {
    const article = await KnowledgeBase.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const article = await KnowledgeBase.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
