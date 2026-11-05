import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { CategoryEntity } from "../../categories/category.entity";
import { ProductOptionEntity } from "./product-option.entity";

@Entity("products")
export class ProductEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  slug!: string;

  @Column({ type: "int", unsigned: true })
  price!: number;

  @Column({ type: "varchar", length: 500, nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 36 })
  categoryId!: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products, {
    onDelete: "RESTRICT",
    nullable: false,
  })
  @JoinColumn({ name: "category_id" })
  category?: CategoryEntity;

  @OneToMany(() => ProductOptionEntity, (option) => option.product)
  options?: ProductOptionEntity[];
}
