
<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use App\Http\Middleware\CheckRole;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Route::middlewareGroup('web', []); // keep your group if needed

        // ✅ Define middleware alias
        Route::aliasMiddleware('role', CheckRole::class);
    }
}
