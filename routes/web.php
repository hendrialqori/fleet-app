<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

Route::get('log-activity-driver', function () {
    return Inertia::render('log-activity-driver');
})->name('log-activity-driver');

Route::get('finding-reports-fleet', function () {
    return Inertia::render('finding-reports-fleet');
})->name('finding-reports-fleet');

Route::get('cartrack-monitoring', function () {
    return Inertia::render('cartrack-monitoring');
})->name('cartrack-monitoring');

Route::get('fleet', function () {
    return Inertia::render('fleet');
})->name('fleet');

Route::get('driver', function () {
    return Inertia::render('driver');
})->name('driver');

Route::get('sign-in', function () {
    return Inertia::render('sign-in');
})->name('sign-in');

// Route::middleware(['auth'])->group(function () {

// });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
