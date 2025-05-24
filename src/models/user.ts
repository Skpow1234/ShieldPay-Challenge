import { Table, Column, Model, DataType, PrimaryKey, Unique, Default, HasMany } from 'sequelize-typescript';
import { Wallet } from './wallet';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password!: string;

  @HasMany(() => Wallet)
  wallets!: Wallet[];
} 