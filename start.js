const { spawn } = require('child_process');
const path = require('path');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');
const node = 'C:\\Program Files\\nodejs\\node.exe';

console.log('🚀 جاري تشغيل المتجر...\n');

const backend = spawn(node, ['server.js'], { cwd: backendDir, stdio: 'inherit' });
const frontend = spawn(node, ['node_modules/vite/bin/vite.js'], { cwd: frontendDir, stdio: 'inherit' });

backend.on('error', () => {
  console.error('❌ فشل تشغيل الباك إند. تأكد من تثبيت Node.js');
});

frontend.on('error', () => {
  console.error('❌ فشل تشغيل الفرونت إند. تأكد من تثبيت Node.js');
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

console.log('✅ الباك إند يشغل على http://localhost:5000');
console.log('✅ الفرونت إند يشغل على http://localhost:3000');
console.log('🌐 افتح http://localhost:3000 في المتصفح');
console.log('\n❌ لإيقاف: اضغط Ctrl+C');
