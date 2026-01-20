import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  invertString(str: string) {
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class RecadosUtilsMock {
  invertString(str: string) {
    return 'BLA BLA bla';
  }
}
