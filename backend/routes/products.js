const express = require('express');
const db = require('../database');
const { authMiddleware } = require('./auth');

const router = express.Router();

function adminOnly(req, res, next) {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });
  next();
}

router.get('/', (req, res) => {
  const { category, featured, search } = req.query;
  let sql = `
    SELECT p.*, c.name as categoryName, c.nameAr as categoryNameAr
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
  `;
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push('p.categoryId = ?');
    params.push(category);
  }
  if (featured === '1') {
    conditions.push('p.isFeatured = 1');
  }
  if (search) {
    conditions.push('(p.name LIKE ? OR p.nameAr LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY p.createdAt DESC';

  const products = db.all(sql, params);
  res.json(products);
});

router.get('/categories', (req, res) => {
  const categories = db.all('SELECT * FROM categories');
  res.json(categories);
});

router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { name, nameAr, description, descriptionAr, price, oldPrice, categoryId, isFeatured, rating, inStock } = req.body;
  if (!name || !nameAr || !price) return res.status(400).json({ error: 'Name and price required' });
  const r = db.run(
    'INSERT INTO products (name, nameAr, description, descriptionAr, price, oldPrice, categoryId, isFeatured, rating, inStock) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [name, nameAr, description || '', descriptionAr || '', price, oldPrice || null, categoryId || 1, isFeatured ? 1 : 0, rating || 4.5, inStock ?? 1]
  );
  res.json({ id: r.lastInsertRowid });
});

router.put('/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, nameAr, description, descriptionAr, price, oldPrice, categoryId, isFeatured, rating, inStock } = req.body;
  db.run(
    'UPDATE products SET name=?, nameAr=?, description=?, descriptionAr=?, price=?, oldPrice=?, categoryId=?, isFeatured=?, rating=?, inStock=? WHERE id=?',
    [name, nameAr, description, descriptionAr, price, oldPrice, categoryId, isFeatured ? 1 : 0, rating, inStock ?? 1, req.params.id]
  );
  res.json({ success: true });
});

router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  db.run('DELETE FROM cart WHERE productId = ?', [req.params.id]);
  db.run('DELETE FROM products WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

router.post('/categories', authMiddleware, adminOnly, (req, res) => {
  const { name, nameAr } = req.body;
  if (!name || !nameAr) return res.status(400).json({ error: 'Name required' });
  const r = db.run('INSERT INTO categories (name, nameAr) VALUES (?,?)', [name, nameAr]);
  res.json({ id: r.lastInsertRowid });
});

router.delete('/categories/:id', authMiddleware, adminOnly, (req, res) => {
  db.run('UPDATE products SET categoryId = 1 WHERE categoryId = ?', [req.params.id]);
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
  res.json({ success: true });
});

router.get('/:id', (req, res) => {
  const product = db.get(`
    SELECT p.*, c.name as categoryName, c.nameAr as categoryNameAr
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    WHERE p.id = ?
  `, [req.params.id]);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  product.images = JSON.parse(product.images || '[]');
  res.json(product);
});

module.exports = router;
