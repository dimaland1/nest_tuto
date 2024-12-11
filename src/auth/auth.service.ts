import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService : UserService,
        private jwtService : JwtService
    ) {}

    async login(name : string, password : string) {
        const user = await this.userService.findOne(name);

        if(!user){
            throw new Error("User not found")
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid Credentials")
        }

        const payload = {username : user.name, password : user.password}
        return {
            acces_token : this.jwtService.sign(payload)
        }
    }
}
