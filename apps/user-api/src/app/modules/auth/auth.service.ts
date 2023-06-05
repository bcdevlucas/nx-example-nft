import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwtoken from 'jsonwebtoken';
import { idKey } from './keys';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
    ) {
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOneBy({ email: username } as FindOptionsWhere<User>);
    // TODO: Turn passwords on!
    // if (user && user.password === pass) {
    if (user) {
      console.log(user);
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  sign(user, _id) {
    const payload = { user, sub: _id };
    const { password, ...userFields } = user;

    return {
      ...userFields,
      accessToken: this.jwtService.sign(payload),
    };
  }

  decodeIdToken(jwt: string): any {
    return jwtoken.verify(jwt, idKey, { algorithms: ['RS256'] }, function (err, decodedToken) {
      // console.log('decodedToken ', decodedToken);
      const { email, phone_number } = decodedToken as any;
      return { email, phone_number };
    });
  }

  // Used in UserGuard
  validateToken(jwt: string) {
    const jwtResult = this.jwtService.verify(jwt);
    const { username = null, sub = null } = jwtResult;
    const hasUser = !!jwtResult;
    return hasUser ? { username, sub } : null;
  }
}
