import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api

<<<<<<< HEAD:phenopacketlab-frontend/src/app/helpers/error.interceptor.ts
                alert('Please log in to acess this feature');

=======
                alert('Please log in to access this feature');
            
>>>>>>> 1046986 (preliminary auth0 integration, logout and login):frontend/src/app/helpers/error.interceptor.ts
            }
            const error = err.error || err.statusText;
            // this.alertService.error(error);
            return throwError(error);
        }));
    }
}
