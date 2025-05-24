import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, AllowNull, Unique, Default, BelongsTo } from 'sequelize-typescript';
import { User } from './user';

@Table({ tableName: 'wallets', timestamps: false })
export class Wallet extends Model<Wallet> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  id!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.UUID })
  user_id!: string;

  @Column({ type: DataType.STRING, allowNull: true })
  tag?: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING })
  chain!: string;

  @Unique
  @AllowNull(false)
  @Column({ type: DataType.STRING })
  address!: string;

  @BelongsTo(() => User)
  user!: User;
} 