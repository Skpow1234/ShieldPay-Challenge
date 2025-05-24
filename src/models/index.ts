import { Sequelize } from 'sequelize-typescript';
import { User } from './user';
import { Wallet } from './wallet';

let sequelize: Sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    models: [User, Wallet],
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    database: 'shieldpay',
    username: 'postgres',
    password: 'postgres',
    host: 'localhost',
    dialect: 'postgres',
    models: [User, Wallet],
    logging: false,
  });
}

export { sequelize, User, Wallet }; 