import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  email: string;
  password: string;
};

const users: User[] = [
  {
    userId: 1,
    email: 'gustavoesmanhotto@hotmail.com',
    password: '123',
  },
  {
    userId: 2,
    email: 'bareta@alunos.utfpr.edu.br',
    password: '321',
  },
];

@Injectable()
export class UsersService {
  async findUserByEmail(email: string): Promise<User | undefined> {
    return users.find((user) => user.email === email);
  }
}
