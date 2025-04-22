import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Verificando os cookies
    const token = request.cookies['token']; // 'token' deve ser o nome do seu cookie

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      request.user = {
        userId: tokenPayload.sub,
        email: tokenPayload.email, // Corrigi a chave 'emai' para 'email'
      };
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
