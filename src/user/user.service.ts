import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PaginationQuery } from 'src/common/dto/pagination-query.dto';
import { FilesService } from 'src/files/files.service';
import { UserEntity } from './user.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class UserService {
  constructor(
    private readonly users: UserRepository,
    private readonly filesService: FilesService,
  ) {}

  async findAll(p: PaginationQuery): Promise<PaginatedResult<UserEntity>> {
    return this.users.findAllPaginated(p);
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByUsername(username: string): Promise<UserEntity> {
    const user = await this.users.findByUsername(username);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.users.findByUsername(dto.username);
    if (existing) throw new ConflictException('Username already exists');

    if (dto.mobileNumber) {
      const mobileClash = await this.users.findByMobileNumber(dto.mobileNumber);
      if (mobileClash) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    const hash = await bcrypt.hash(dto.password, 12);
    const entity = this.users.create({
      userGroupId: dto.userGroupId,
      username: dto.username,
      password: hash,
      firstname: dto.firstname,
      lastname: dto.lastname,
      email: dto.email,
      nationalId: dto.nationalId,
      birthdate: dto.birthdate,
      gender: dto.gender,
      mobileNumber: dto.mobileNumber,
      address: dto.address,
      status: dto.status,
    });

    let user = await this.users.save(entity);

    if (dto.profile) {
      const { objectKey } = await this.filesService.copyTmpFileToObjectStorage(
        'user-profile',
        dto.profile,
        user.id,
      );

      user.profile = objectKey;
    }

    if (dto.profile) {
      user = await this.users.save(user);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.users.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (dto.username && dto.username !== user.username) {
      const nameClash = await this.users.findByUsername(dto.username);
      if (nameClash && nameClash.id !== id) {
        throw new ConflictException('Group name already exists');
      }
    }

    if (dto.mobileNumber) {
      const mobileClash = await this.users.findByMobileNumber(dto.mobileNumber);
      if (mobileClash && mobileClash.id !== id) {
        throw new ConflictException('Mobile number already exists');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 12);
    }

    if (dto.profile) {
      const { objectKey } = await this.filesService.copyTmpFileToObjectStorage(
        'user-profile',
        dto.profile,
        user.id,
      );
      user.profile = objectKey;
    }

    const { profile, ...rest } = dto;

    Object.assign(user, rest);

    return this.users.save(user);
  }

  async remove(id: number) {
    await this.users.removeById(id);
    return { success: true };
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.users.findByUsername(username);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }
}
