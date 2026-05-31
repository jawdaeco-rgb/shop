const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb, all, run } = require('./database');
const { router: authRouter } = require('./routes/auth');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'مرحباً بكم في متجر الملابس والعطور' });
});

const frontendBuild = path.join(__dirname, 'public');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return;
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

async function autoSeed() {
  const existing = all("SELECT count(*) as count FROM users WHERE email = 'admin@shop.com'");
  if (existing[0].count > 0) return;

  const bcrypt = require('bcryptjs');

  run('INSERT INTO categories (name, nameAr) VALUES (?, ?)', ['Clothes', 'ملابس']);
  run('INSERT INTO categories (name, nameAr) VALUES (?, ?)', ['Perfumes', 'عطور']);
  run('INSERT INTO categories (name, nameAr) VALUES (?, ?)', ['Accessories', 'إكسسوارات']);

  const adminPass = bcrypt.hashSync('admin123', 10);
  const userPass = bcrypt.hashSync('user123', 10);
  run('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', ['Admin', 'admin@shop.com', adminPass, 1]);
  run('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', ['يوسف', 'user@shop.com', userPass, 0]);

  const products = [
    { n: 'Floral Summer Dress', na: 'فستان صيفي بالورود', p: 89.99, op: 129.99, c: 1, f: 1, r: 4.8 },
    { n: 'Elegant Blouse', na: 'بلوزة أنيقة', p: 54.99, op: null, c: 1, f: 1, r: 4.6 },
    { n: 'Denim Jacket', na: 'جاكيت دينم', p: 119.99, op: 159.99, c: 1, f: 0, r: 4.5 },
    { n: 'Pleated Midi Skirt', na: 'تنورة ميدي مطوية', p: 64.99, op: null, c: 1, f: 1, r: 4.7 },
    { n: 'Cashmere Sweater', na: 'كنزة كشمير', p: 149.99, op: 199.99, c: 1, f: 0, r: 4.9 },
    { n: 'Summer T-Shirt', na: 'تي شيرت صيفي', p: 29.99, op: null, c: 1, f: 0, r: 4.3 },
    { n: 'Rose Elegance', na: 'أناقة الورد', p: 89.99, op: 119.99, c: 2, f: 1, r: 4.9 },
    { n: 'Lavender Dreams', na: 'أحلام اللافندر', p: 74.99, op: null, c: 2, f: 1, r: 4.7 },
    { n: 'Citrus Burst', na: 'انفجار حمضيات', p: 59.99, op: 79.99, c: 2, f: 0, r: 4.5 },
    { n: 'Oriental Mystery', na: 'غموض شرقي', p: 129.99, op: null, c: 2, f: 1, r: 4.8 },
    { n: 'White Musk', na: 'مسك أبيض', p: 69.99, op: 89.99, c: 2, f: 0, r: 4.6 },
    { n: 'Vanilla & Honey', na: 'فانيليا وعسل', p: 84.99, op: null, c: 2, f: 0, r: 4.4 },
    { n: 'Pearl Necklace', na: 'عقد لؤلؤ', p: 45.99, op: 64.99, c: 3, f: 1, r: 4.7 },
    { n: 'Silk Scarf', na: 'وشاح حريري', p: 34.99, op: null, c: 3, f: 0, r: 4.5 },
    { n: 'Gold Bracelet', na: 'سوار ذهبي', p: 159.99, op: 199.99, c: 3, f: 1, r: 4.8 },
  ];

  for (const p of products) {
    run('INSERT INTO products (name, nameAr, price, oldPrice, categoryId, isFeatured, rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [p.n, p.na, p.p, p.op, p.c, p.f, p.r]);
  }

  console.log(`✓ Auto-seeded: ${products.length} products, 2 users, 3 categories`);
}

async function start() {
  await getDb();
  autoSeed();
  console.log('✓ Database ready');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
}

start();
