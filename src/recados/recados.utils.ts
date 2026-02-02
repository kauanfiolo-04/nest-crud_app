import { Injectable } from '@nestjs/common';

@Injectable()
export class RecadosUtils {
  invertString(str: string) {
    return str.split('').reverse().join('');
  }
}

@Injectable()
export class RecadosUtilsMock {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invertString(__: string) {
    return 'BLA BLA bla';
  }
}
