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

