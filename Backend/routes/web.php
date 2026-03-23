<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FiliereController;

Route::get('/', function () {
    return view('filiere');
});


