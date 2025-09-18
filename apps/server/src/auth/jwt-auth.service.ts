import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) { }

  signJWT(user: { id: string; email: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
}
