const express = require('express');
const db = require('../database');
const { authMiddleware } = require('./auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const items = db.all(`
    SELECT c.id, c.quantity, p.id as productId, p.name, p.nameAr, p.price, p.oldPrice, p.image, p.inStock
    FROM cart c
    JOIN products p ON c.productId = p.id
    WHERE c.userId = ?
  `, [req.user.id]);
  res.json(items);
});

router.post('/', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const existing = db.get('SELECT * FROM cart WHERE userId = ? AND productId = ?', [req.user.id, productId]);
  if (existing) {
    db.run('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id]);
  } else {
    db.run('INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)', [req.user.id, productId, quantity]);
  }
  res.json({ success: true });
});

router.put('/:id', (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) {
    db.run('DELETE FROM cart WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
  } else {
    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND userId = ?', [quantity, req.params.id, req.user.id]);
  }
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

router.delete('/', (req, res) => {
  db.run('DELETE FROM cart WHERE userId = ?', [req.user.id]);
  res.json({ success: true });
});

module.exports = router;
