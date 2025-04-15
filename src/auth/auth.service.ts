import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = { email: string; password: string };
type SignInData = {
  userId: number;
  email: string;
};
type AuthResult = {
  userId: number;
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
    if (user && user.password === input.password) {
      return {
        userId: user.userId,
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
