import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/user.entity';
import { UserGroupEntity } from 'src/user/group/user-group.entity';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserGroupEntity)
    private readonly groupRepo: Repository<UserGroupEntity>,
  ) {}

  async run() {
    const existingAdminGroup = await this.groupRepo.findOne({
      where: { name: 'admin' },
    });
    let adminGroup = existingAdminGroup;

    if (!existingAdminGroup) {
      adminGroup = this.groupRepo.create({
        name: 'admin',
        isAdmin: true,
      });
      await this.groupRepo.save(adminGroup);
      this.logger.log('Created default userGroup: admin');
    }

    const existingUser = await this.userRepo.findOne({
      where: { username: 'admin' },
    });
    if (existingUser) {
      this.logger.log('Seeder skipped — admin user already exists.');
      return;
    }

    const password = await bcrypt.hash('Admin@123', 12);

    const adminUser = this.userRepo.create({
      username: 'admin',
      password,
      firstname: 'System',
      lastname: 'Admin',
      email: 'admin@example.com',
      gender: 'male',
      userGroup: adminGroup,
      status: true,
    });

    await this.userRepo.save(adminUser);

    this.logger.log(`Default user created: username=admin, password=Admin@123`);
  }
}
