import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { ProductEntity } from "../../products/entities/product.entity";
import { ProductOptionTypes } from "../../products/enums/product-option-type.enum";
import { OrderEntity } from "./order.entity";

interface SelectedOptions {
  name: string;
  type: ProductOptionTypes;
  priceDelta: number;
}

@Entity("order_items")
export class OrderItemEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  productName!: string;

  @Column({ type: "int", unsigned: true })
  unitPrice!: number;

  @Column({ type: "int", unsigned: true })
  quantity!: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  note!: string | null;

  @Column({ type: "json" })
  selectedOptions!: SelectedOptions[];

  @Column({ type: "varchar", length: 36 })
  orderId!: string;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: "order_id" })
  order?: OrderEntity;

  @Column({ type: "varchar", length: 36 })
  productId!: string;

  @ManyToOne(() => ProductEntity, { onDelete: "SET NULL", nullable: true })
  @JoinColumn({ name: "product_id" })
  product?: ProductEntity | null;
}
