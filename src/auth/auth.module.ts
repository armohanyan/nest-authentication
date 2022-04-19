import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy ";

@Module({
    imports: [
      TypeOrmModule.forFeature([User]),
      JwtModule.register({})
    ],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy]
})
export class AuthModule {
}
