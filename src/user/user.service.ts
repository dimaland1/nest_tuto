import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {
    }

    private readonly users = [];

    async create(createUserDto: CreateUserDto) {
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await this.usersRepository.findOne({
            where: {
                name: createUserDto.name,
                age: createUserDto.age,
            },
        });

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        // Hasher le mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

        // Créer le nouvel utilisateur
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });

        await this.usersRepository.save(user);

        // Ne pas renvoyer le mot de passe
        const { password, ...result } = user;
        return result;
    }

    findOne(name: string) {
        return this.usersRepository.findOne({
            where: {name},
        });
    }
}