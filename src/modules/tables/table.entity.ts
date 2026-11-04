import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "../../common/entities/base.entity";
import { OrderEntity } from "../orders/entities/order.entity";

@Entity("tables")
export class TableEntity extends AppBaseEntity {
  @Column({ type: "int", unsigned: true, unique: true })
  number!: number;

  @Column({ type: "varchar", length: 64, unique: true })
  qrToken!: string;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => OrderEntity, (order) => order.table)
  orders?: OrderEntity[];
}
