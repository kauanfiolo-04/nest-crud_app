/* eslint-disable @typescript-eslint/no-unsafe-return */
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(error => {
        console.log('Deu Error');

        return throwError(() => error);
      })
    );
  }
}
