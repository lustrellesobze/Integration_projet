<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use HasFactory;

    protected $table = 'salles';

    protected $primaryKey = 'num_salle';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'num_salle',
        'contenance',
        'status',
    ];

    public $timestamps = true;
}
