import { HashingService } from './hashing.service';
import * as bc from 'bcryptjs';

export class BcryptService extends HashingService {
  async hash(password: string): Promise<string> {
    const salt = await bc.genSalt();

    return bc.hash(password, salt);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return await bc.compare(password, passwordHash);
  }
}
