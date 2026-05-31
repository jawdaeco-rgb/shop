@echo off
chcp 65001 >nul
echo 🔃 جاري تشغيل المتجر...
start /B /MIN "" "C:\Program Files\nodejs\node.exe" "C:\Users\YOUSSEF\Desktop\موقع لبيع\backend\server.js"
timeout /t 3 /nobreak >nul
start /B /MIN "" "C:\Program Files\nodejs\node.exe" "C:\Users\YOUSSEF\Desktop\موقع لبيع\frontend\node_modules\vite\bin\vite.js"
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"
echo ✅ تم التشغيل - الموقع في المتصفح
exit