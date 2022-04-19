import { Controller, Post, Get, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { SignUpDto, SignInDto } from "./dto"

@Controller("auth")
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("sign-up")
    signUp(@Body() user: SignUpDto) {
        return this.authService.signUp(user);
    }

    @Post("sign-in")
    signIn(@Body() user: SignInDto) {
        return this.authService.signIn(user)
    }

    @Get()
    async getAll(): Promise<User[]> {
        return await this.authService.getAll()
     }

}
