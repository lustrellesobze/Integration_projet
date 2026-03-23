<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model; // 👈 Import obligatoire pour UUID
use Illuminate\Support\Str;

class Programmation extends Model
{
    use HasFactory;

    protected $table = 'programmations';

    protected $primaryKey = 'id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'code_ec',
        'num_salle',
        'code_pers',
        'date',
        'heure_debut',
        'heure_fin',
        'nbre_heure',
        'status',
    ];

    public $timestamps = true;

    /**
     * 🔥 Génération automatique d’un UUID avant insertion
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }

    /**
     * Relations
     */
    public function ec()
    {
        return $this->belongsTo(Ec::class, 'code_ec', 'code_ec');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class, 'num_salle', 'num_salle'); // ✔ Correction
    }

    public function personnel()
    {
        return $this->belongsTo(Personnel::class, 'code_pers', 'code_pers');
    }
}
