import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

type AuthInput = { email: string; password: string };
type SignInData = {
  userId: string;
  email: string;
};
type AuthResult = {
  userId: string;
  email: string;
  token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult | null> {
    const user = await this.validateUser(input);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByEmail(input.email);
    if (user && await bcrypt.compare(input.password, user.password)) {
      return {
        userId: user.id,
        email: user.email,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const payload = { sub: user.userId, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      userId: user.userId,
      email: user.email,
      token,
    };
  }
}
