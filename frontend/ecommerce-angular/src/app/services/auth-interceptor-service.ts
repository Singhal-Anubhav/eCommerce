import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { from, lastValueFrom, Observable, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor{

  baseUrl: String = environment.eCommerceApiUrl;

  constructor(@Inject(AuthService)private auth: AuthService){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req,next));
  }

  private handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    const secureEndpoints = [`${this.baseUrl}/orders`,`${this.baseUrl}/orderses`];

    if(secureEndpoints.some((url)=> req.urlWithParams.includes(url))){
      return lastValueFrom(this.auth.getAccessTokenSilently().pipe(
        switchMap((token: string) => {
          console.log(`Access Token: ${token}`);
          const cloned = req.clone({
            setHeaders:{
              Authorization: `Bearer ${token}`
            }
          });
          return next.handle(cloned);
        })
      ));
       
    }

    return lastValueFrom(next.handle(req));
  }

}
