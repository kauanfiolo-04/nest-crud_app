import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  invertString(str: string) {
    return str.split('').reverse().join('');
  }
}
