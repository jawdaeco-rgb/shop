const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./database');
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

// Serve built frontend
const frontendBuild = path.join(__dirname, 'public');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return;
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

async function start() {
  await getDb();
  console.log('✓ Database ready');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server running on port ${PORT}`);
  });
}

start();
