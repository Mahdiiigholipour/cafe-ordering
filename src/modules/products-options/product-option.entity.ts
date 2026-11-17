import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { ProductOptionTypes } from "../enums/product-option-type.enum";
import { ProductEntity } from "./product.entity";

@Entity("product_options")
export class ProductOptionEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "enum", enum: ProductOptionTypes })
  type!: ProductOptionTypes;

  @Column({ type: "int", default: 0 })
  priceDelta!: number;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 36 })
  productId!: string;

  @ManyToOne(() => ProductEntity, (product) => product.options, {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "product_id" })
  product?: ProductEntity;
}
