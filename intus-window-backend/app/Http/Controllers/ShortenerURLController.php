<?php

namespace App\Http\Controllers;

use App\Models\ShortenerUrl;
use Illuminate\Http\Request;
use App\Http\Requests\ShortenerURLRequest;
use App\Http\Resources\ShortenerURLResource;
use App\Http\Controllers\JsonResponseFunction as jsonResponse;

class ShortenerURLController extends Controller{

    public function index(){
        return ShortenerURLResource::collection(ShortenerUrl::all());
    }


    public function store(ShortenerURLRequest $request){
        //$hash= $this->generateShortenerUrl();
      //  $result = DB::table("shortener_urls")->where("shortener_url", $short_url)->get();

        $data = $request->all();
        $short_url= $_SERVER['SERVER_NAME'] . ":" . $_SERVER['SERVER_PORT'] . "/" . $data["hash"];
        $shortener_url = new ShortenerUrl;
        $shortener_url->original_url = $data["original_url"];
        $shortener_url->shortener_url = $short_url;
        $shortener_url->hash = $data["hash"];
        $shortener_url->save();

        return jsonResponse::createdSuccessReponse($shortener_url);
    }


    public function generateShortenerUrl(){
        $hash = substr(str_shuffle(md5(microtime())), 0, 6);
        $result = ShortenerUrl::where('hash', '=', $hash)->first();
        if($result){
            return Response()->json([
                        'success' => false,
                        'message' => 'exist',
                        'data' => $hash
                    ], 200);
        }else{
            return Response()->json([
                        'success' => true,
                        'message' => 'not exist',
                        'data' => $hash
                    ], 200);
        }
    }

    public function redirectUrl($hash){
        $url = ShortenerUrl::where('hash', '=', $hash)->first();
       
        if($url){
            return redirect()->to($url->original_url);
        }
        echo "Enter url not found! Please try with valid shortener url.";
    }
}
