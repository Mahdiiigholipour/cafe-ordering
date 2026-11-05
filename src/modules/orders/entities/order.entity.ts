import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { TableEntity } from "../../tables/table.entity";
import { OrderStatus } from "../enums/order-status.enum";
import { OrderItemEntity } from "./order-items.entity";

@Entity("orders")
@Unique(["orderDate", "orderNumber"])
@Index(["status", "createdAt"])
export class OrderEntity extends AppBaseEntity {
  @Column({ type: "date" })
  orderDate!: string;

  @Column({ type: "int", unsigned: true })
  orderNumber!: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status!: OrderStatus;

  @Column({ type: "int", unsigned: true })
  subtotal!: number;

  @Column({ type: "int", unsigned: true })
  taxAmount!: number;

  @Column({ type: "int", unsigned: true })
  serviceAmount!: number;

  @Column({ type: "int", unsigned: true })
  totalAmount!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  cancelReason!: string | null;

  @Column({ type: "varchar", length: 36 })
  tableId!: string;

  @ManyToOne(() => TableEntity, (table) => table.orders, {
    onDelete: "RESTRICT",
    nullable: false,
  })
  @JoinColumn({ name: "table_id" })
  table?: TableEntity;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items?: OrderItemEntity[];
}
