/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimingConnectionInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const startTime = Date.now();

    await new Promise(resolve => setTimeout(resolve, 100));

    return next.handle().pipe(
      tap(() => {
        const finalTime = Date.now();

        const elapsedTime = finalTime - startTime;

        console.log(`TimingConnectionInterceptor: levou ${elapsedTime}ms para executar.`);
      })
    );
  }
}
