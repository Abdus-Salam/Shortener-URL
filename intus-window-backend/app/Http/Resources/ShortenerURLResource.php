<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\User;
use Auth;

class ShortenerURLResource extends JsonResource{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request){
        
        return[
            'id' => $this->id,
            'shortener_url' => $this->shortener_url,
            'original_url' => $this->original_url,
        ];
    }
}
