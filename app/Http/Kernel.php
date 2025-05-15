<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    // Global middleware
    protected $middleware = [
        \Illuminate\Http\Middleware\HandleCors::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    // Middleware groups
    protected $middlewareGroups = [
        'web' => [
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],

        'api' => [
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    // Route middleware (used by name)
    protected $routeMiddleware = [
        // 'auth'       => \App\Http\Middleware\Authenticate::class,
        // 'guest'      => \App\Http\Middleware\RedirectIfAuthenticated::class,
        // 'verified'   => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
    
        // // ✅ This line is what tells Laravel what "role" means
        // 'role'       => \App\Http\Middleware\EnsureUserHasRole::class,
    ];
    
}
