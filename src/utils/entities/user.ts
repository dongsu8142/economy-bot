import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryColumn({ unique: true, name: "user_id" })
  userId: string;

  @Column({ name: "money", default: 10000, nullable: false })
  money: number;

  @Column({ name: "BTC", default: 0, nullable: false })
  BTC: number;

  @Column({ name: "ETH", default: 0, nullable: false })
  ETH: number;

  @Column({ name: "ETC", default: 0, nullable: false })
  ETC: number;

  @Column({ name: "DOGE", default: 0, nullable: false })
  DOGE: number;

  @Column({ name: "XRP", default: 0, nullable: false })
  XRP: number;

  @Column({ name: "BCH", default: 0, nullable: false })
  BCH: number;

  @Column({ name: "FLOW", default: 0, nullable: false })
  FLOW: number;

  @Column({ name: "SAND", default: 0, nullable: false })
  SAND: number;

  @Column({ name: "WAVES", default: 0, nullable: false })
  WAVES: number;

  @Column({ name: "xp", default: 0, nullable: false })
  xp: number;

  @Column({ name: "level", default: 0, nullable: false })
  level: number;
}
