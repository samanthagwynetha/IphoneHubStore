📱 iPhoneHub – iPhone E-Commerce Platform
iPhoneHub is a web-based e-commerce platform focused exclusively on iPhones, offering both brand-new and pre-owned devices. Designed for convenience, trust, and accessibility, it caters to a wide range of customers—from tech enthusiasts looking for the latest models to budget-conscious buyers seeking quality second-hand units.
🔧 Features
🛍️ Seamless browsing of new and used iPhone listings

📦 Inventory management for both product types

🔍 Detailed product information and condition tags

🌱 Encourages sustainable tech consumption

🌐 Built for accessibility and ease of use


🛠️Installation
git clone https://github.com/samanthagwynetha/IphoneHubStore.git
cd IphoneHubStore
composer install
cp .env.example .env

copy paste env:
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=iphonehubDB
DB_USERNAME=postgres
DB_PASSWORD=s4mp0s7

php artisan config:clear
php artisan migrate --seed
php artisan key:generate

npm install
npm run dev
php artisan serve

