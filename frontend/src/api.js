const API = '/api';
export const WHATSAPP_NUMBER = '212653136446'; // ضع رقم واتساب هنا (بدون +)

function getToken() {
  return localStorage.getItem('token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function register(name, email, password, phone) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) });
}

export function getMe() {
  return request('/auth/me');
}

export function updateProfile(data) {
  return request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) });
}

export function getProducts(params = {}) {
  const q = new URLSearchParams(params).toString();
  return request(`/products${q ? '?' + q : ''}`);
}

export function getProduct(id) {
  return request(`/products/${id}`);
}

export function getCategories() {
  return request('/products/categories');
}

export function getCart() {
  return request('/cart');
}

export function addToCart(productId, quantity = 1) {
  return request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) });
}

export function updateCartItem(id, quantity) {
  return request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
}

export function removeCartItem(id) {
  return request(`/cart/${id}`, { method: 'DELETE' });
}

export function createOrder(data) {
  return request('/orders', { method: 'POST', body: JSON.stringify(data) });
}

export function getOrders() {
  return request('/orders');
}

export function getAllOrders() {
  return request('/orders/all');
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
}

export function createProduct(data) {
  return request('/products', { method: 'POST', body: JSON.stringify(data) });
}

export function updateProduct(id, data) {
  return request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteProduct(id) {
  return request(`/products/${id}`, { method: 'DELETE' });
}

export function createCategory(data) {
  return request('/products/categories', { method: 'POST', body: JSON.stringify(data) });
}

export function deleteCategory(id) {
  return request(`/products/categories/${id}`, { method: 'DELETE' });
}

export function getWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
