export function getProductImage(product, size = 400) {
  const seed = encodeURIComponent(product.name || `product-${product.id}`);
  return `https://picsum.photos/seed/${seed}/${size}/${size}`;
}

export function getCategoryImage(category) {
  const images = {
    1: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400',
    2: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    3: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
  };
  return images[category] || images[1];
}
