import { Column, Entity, OneToMany } from "typeorm";
import { AppBaseEntity } from "../../common/entities/base.entity";
import { ProductEntity } from "../products/entities/product.entity";

@Entity("categories")
export class CategoryEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 120, unique: true })
  slug!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  image!: string | null;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products?: ProductEntity[];
}
