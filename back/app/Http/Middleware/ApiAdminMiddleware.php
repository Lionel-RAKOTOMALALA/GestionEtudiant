<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class ApiAdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if(Auth::check()){
            if(auth()->user()->tokenCan('server:admin')){
                return $next($request);
            }else{
                return response()->json([
                    'status'=>403,
                    'message'=>'Acces refusé! vous n\' êtes pas un admin'
                ],403);
            }
        }
        else{
            return response()->json([
                'status'=>401,
                'message'=>'Veuillez vous connecter'
            ]);
        }
        
    }
}
