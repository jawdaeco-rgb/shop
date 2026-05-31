const express = require('express');
const db = require('../database');
const { authMiddleware } = require('./auth');

const router = express.Router();

router.use(authMiddleware);

router.post('/', (req, res) => {
  const { items, shippingName, shippingPhone, shippingAddress, shippingCity } = req.body;
  if (!items?.length) return res.status(400).json({ error: 'Cart is empty' });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const result = db.run(
    'INSERT INTO orders (userId, items, total, shippingName, shippingPhone, shippingAddress, shippingCity) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [req.user.id, JSON.stringify(items), total, shippingName, shippingPhone, shippingAddress, shippingCity]
  );

  db.run('DELETE FROM cart WHERE userId = ?', [req.user.id]);

  res.json({ id: result.lastInsertRowid, total });
});

router.get('/', (req, res) => {
  const orders = db.all('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [req.user.id]);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

router.get('/all', (req, res) => {
  const { isAdmin } = req.user;
  if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });
  const orders = db.all(`
    SELECT o.*, u.name as userName
    FROM orders o
    JOIN users u ON o.userId = u.id
    ORDER BY o.createdAt DESC
  `);
  res.json(orders.map(o => ({ ...o, items: JSON.parse(o.items) })));
});

router.put('/:id/status', (req, res) => {
  const { isAdmin } = req.user;
  if (!isAdmin) return res.status(403).json({ error: 'Unauthorized' });
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ success: true });
});

module.exports = router;
