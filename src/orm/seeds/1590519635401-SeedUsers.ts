import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

import { UserRole } from '../entities/users/types';
import { User } from '../entities/users/User';

export class SeedUsers1590519635401 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    const userRepository = getRepository(User);

    user.first_name = 'Walter';
    user.last_name = 'White';
    user.email = 'admin@admin.com';
    user.password = 'pass1';
    user.hashPassword();
    user.role = UserRole.SPEAKER;
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Jesse';
    user.last_name = 'Pinkman';
    user.email = 'standard@standard.com';
    user.password = 'pass1';
    user.hashPassword();
    user.role = UserRole.STANDARD;
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Skyler';
    user.last_name = 'White';
    user.email = 'skyler.white@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Hank';
    user.last_name = 'Schrader';
    user.email = 'hank.schrader@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Marie';
    user.last_name = 'Schrader';
    user.email = 'marie.schrader@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Saul';
    user.last_name = 'Goodman';
    user.email = 'saul.goodman@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Gustavo';
    user.last_name = 'Fring';
    user.email = 'gustavo.fring@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Michael';
    user.last_name = 'Ehrmantraut';
    user.email = 'michael.ehrmantraut@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Hector';
    user.last_name = 'Salamanca';
    user.email = 'hector.salamanca@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);

    user = new User();
    user.first_name = 'Alberto';
    user.last_name = 'Salamanca';
    user.email = 'alberto.salamanca@test.com';
    user.password = 'pass1';
    user.hashPassword();
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    console.log('Not implemented');
  }
}
