const { getDb, run, all, saveDb } = require('./database');
const bcrypt = require('bcryptjs');

async function seed() {
  await getDb();
  console.log('جاري إضافة البيانات التجريبية...');

  // Clear existing data
  run('DELETE FROM orders');
  run('DELETE FROM cart');
  run('DELETE FROM products');
  run('DELETE FROM categories');
  run('DELETE FROM users');

  // Categories
  run('INSERT INTO categories (name, nameAr, image) VALUES (?, ?, ?)', ['Clothes', 'ملابس', '/images/category-clothes.jpg']);
  run('INSERT INTO categories (name, nameAr, image) VALUES (?, ?, ?)', ['Perfumes', 'عطور', '/images/category-perfumes.jpg']);
  run('INSERT INTO categories (name, nameAr, image) VALUES (?, ?, ?)', ['Accessories', 'إكسسوارات', '/images/category-accessories.jpg']);

  // Admin user
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  run('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', ['Admin', 'admin@shop.com', hashedPassword, 1]);
  run('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)', ['يوسف', 'user@shop.com', bcrypt.hashSync('user123', 10), 0]);

  // Products
  const allProducts = [
    // Clothes (categoryId: 1)
    { n: 'Floral Summer Dress', na: 'فستان صيفي بالورود', p: 89.99, op: 129.99, d: 'Beautiful floral dress perfect for summer days. Lightweight and comfortable fabric.', da: 'فستان صيفي جميل مع نقوش وردية. قماش خفيف ومريح.', c: 1, f: 1, r: 4.8 },
    { n: 'Elegant Blouse', na: 'بلوزة أنيقة', p: 54.99, op: null, d: 'Classy silk blouse for professional and casual wear.', da: 'بلوزة حريرية كلاسيكية مناسبة للعمل والمناسبات.', c: 1, f: 1, r: 4.6 },
    { n: 'Denim Jacket', na: 'جاكيت دينم', p: 119.99, op: 159.99, d: 'Trendy denim jacket with a modern fit.', da: 'جاكيت دينم عصري بقصة حديثة.', c: 1, f: 0, r: 4.5 },
    { n: 'Pleated Midi Skirt', na: 'تنورة ميدي مطوية', p: 64.99, op: null, d: 'Elegant pleated midi skirt for a sophisticated look.', da: 'تنورة ميدي أنيقة مع طيات للحصول على إطلالة راقية.', c: 1, f: 1, r: 4.7 },
    { n: 'Cashmere Sweater', na: 'كنزة كشمير', p: 149.99, op: 199.99, d: 'Luxurious cashmere sweater for cold days.', da: 'كنزة كشمير فاخرة للأيام الباردة.', c: 1, f: 0, r: 4.9 },
    { n: 'Summer T-Shirt', na: 'تي شيرت صيفي', p: 29.99, op: null, d: 'Cotton t-shirt available in multiple colors.', da: 'تي شيرت قطني متوفر بعدة ألوان.', c: 1, f: 0, r: 4.3 },
    // Perfumes (categoryId: 2)
    { n: 'Rose Elegance', na: 'أناقة الورد', p: 89.99, op: 119.99, d: 'A captivating rose fragrance with notes of jasmine and vanilla.', da: 'عطر آسر برائحة الورد مع لمسات الياسمين والفانيليا.', c: 2, f: 1, r: 4.9 },
    { n: 'Lavender Dreams', na: 'أحلام اللافندر', p: 74.99, op: null, d: 'Calming lavender blend with hints of amber and musk.', da: 'مزيج لافندر هادئ مع لمحات من العنبر والمسك.', c: 2, f: 1, r: 4.7 },
    { n: 'Citrus Burst', na: 'انفجار حمضيات', p: 59.99, op: 79.99, d: 'Fresh citrus fragrance with orange, lemon and grapefruit.', da: 'عطر حمضي منعش بالبرتقال والليمون والجريب فروت.', c: 2, f: 0, r: 4.5 },
    { n: 'Oriental Mystery', na: 'غموض شرقي', p: 129.99, op: null, d: 'Rich oriental perfume with oud, saffron and rose.', da: 'عطر شرقي غني بالعود والزعفران والورد.', c: 2, f: 1, r: 4.8 },
    { n: 'White Musk', na: 'مسك أبيض', p: 69.99, op: 89.99, d: 'Soft and delicate white musk for everyday elegance.', da: 'مسك أبيض ناعم ورقيق للأناقة اليومية.', c: 2, f: 0, r: 4.6 },
    { n: 'Vanilla & Honey', na: 'فانيليا وعسل', p: 84.99, op: null, d: 'Sweet vanilla and honey perfume with a warm finish.', da: 'عطر حلو بالفانيليا والعسل مع لمسة دافئة.', c: 2, f: 0, r: 4.4 },
    // Accessories (categoryId: 3)
    { n: 'Pearl Necklace', na: 'عقد لؤلؤ', p: 45.99, op: 64.99, d: 'Elegant pearl necklace for special occasions.', da: 'عقد لؤلؤ أنيق للمناسبات الخاصة.', c: 3, f: 1, r: 4.7 },
    { n: 'Silk Scarf', na: 'وشاح حريري', p: 34.99, op: null, d: 'Luxurious silk scarf with floral patterns.', da: 'وشاح حريري فاخر بنقوش وردية.', c: 3, f: 0, r: 4.5 },
    { n: 'Gold Bracelet', na: 'سوار ذهبي', p: 159.99, op: 199.99, d: '18k gold plated bracelet with delicate design.', da: 'سوار مطلي بالذهب عيار 18 بتصميم أنيق.', c: 3, f: 1, r: 4.8 },
  ];

  let imgIdx = 1;
  for (const p of allProducts) {
    const images = JSON.stringify([`/images/product${imgIdx}.jpg`, `/images/product${imgIdx}b.jpg`, `/images/product${imgIdx}c.jpg`]);
    run(
      'INSERT INTO products (name, nameAr, description, descriptionAr, price, oldPrice, image, images, categoryId, isFeatured, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [p.n, p.na, p.d, p.da, p.p, p.op, `/images/product${imgIdx}.jpg`, images, p.c, p.f, p.r]
    );
    imgIdx++;
  }

  console.log(`✓ تم إضافة ${allProducts.length} منتج`);
  console.log('✓ تم إضافة المستخدمين (admin@shop.com / user@shop.com)');
  console.log('✓ كلمة السر: admin123 / user123');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
