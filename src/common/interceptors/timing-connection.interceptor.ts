import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();

        const elapsedTime = finalTime - startTime;

        console.log(`TimingConnectionInterceptor: levou ${elapsedTime}ms para executar.`);
      })
    );
  }
}
