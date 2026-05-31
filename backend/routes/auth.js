const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const router = express.Router();
const SECRET = 'shop-secret-key-2024';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.post('/register', (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  try {
    const hashed = bcrypt.hashSync(password, 10);
    const result = db.run('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)', [name, email, hashed, phone || '']);
    const token = jwt.sign({ id: result.lastInsertRowid, email, isAdmin: 0 }, SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, name, email, isAdmin: 0 } });
  } catch (e) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, isAdmin: user.isAdmin }, SECRET);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.get('SELECT id, name, email, phone, address, isAdmin FROM users WHERE id = ?', [req.user.id]);
  res.json(user);
});

router.put('/profile', authMiddleware, (req, res) => {
  const { name, phone, address } = req.body;
  db.run('UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?', [name, phone, address, req.user.id]);
  res.json({ success: true });
});

module.exports = { router, authMiddleware };
