import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as argon from "argon2";
import { SignUpDto, SignInDto } from "./dto"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {
  }

  getAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ["posts"]
    });
  }

  async signUp(dto: SignUpDto) {

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.usersRepository.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hash
      });

      await this.usersRepository.save(user);
      delete user.password;

      return user
    } catch (error) {
      if (error.errno === 1062) {
        throw new ForbiddenException("User already exist")
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {

    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email
      }
    })

    if (!user) throw new ForbiddenException("Wrong email and/or password");

    const pwMatches = await argon.verify(
      user.password,
      dto.password
    )

    if (!pwMatches) throw new ForbiddenException("Wrong password");

    return {
      accessToken: await this.signToken(user.id, user.email)
    }
  }

  signToken(userId: number, email: string): Promise<string> {

    const payload = {
      sub: userId,
      email
    }
    const secret = this.config.get("JWT_TOKEN")

    return this.jwt.signAsync(payload, {
      expiresIn: "15",
      secret
    })

  }
}
