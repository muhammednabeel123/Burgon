import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@models/User';
import config from '@config/config';

@Service()
export class AuthService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  // ---- Login ----
  async login(email: string, password: string): Promise<{ token: string; user: Partial<User> }> {
    let userRecord = await this.userRepository
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .andWhere('u.is_deleted = 0')
      .andWhere('u.is_active = 1')
      .getOne();

    if (!userRecord) {
      throw new Error('Invalid credentials');
    }

    let isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    let token = jwt.sign(
      { userId: userRecord.id, role: userRecord.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn as any },
    );

    let { password: _pw, ...userWithoutPassword } = userRecord;

    return { token, user: userWithoutPassword };
  }

  // ---- Register staff ----
  async register(data: {
    name: string;
    email: string;
    password: string;
    role: string;
    gender: string;
    phone: string;
  }): Promise<User> {
    let existingUser = await this.userRepository.findOne({
      where: { email: data.email, is_deleted: 0 },
    });

    if (existingUser) {
      throw new Error('Email already in use');
    }

    let hashedPassword = await bcrypt.hash(data.password, 10);

    let newUser = this.userRepository.create({
      name:     data.name,
      email:    data.email,
      password: hashedPassword,
      role:     data.role,
      gender:   data.gender,
      phone:    data.phone,
    });

    return await this.userRepository.save(newUser);
  }
}
