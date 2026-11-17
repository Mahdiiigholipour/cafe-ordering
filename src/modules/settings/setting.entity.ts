import { Column, Entity } from "typeorm";
import { AppBaseEntity } from "../../common/entities/base.entity";

@Entity("settings")
export class SettingEntity extends AppBaseEntity {
  @Column({ type: "varchar", length: 100 })
  cafeName!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  logo!: string | null;

  @Column({ type: "time" })
  openingTime!: string;

  @Column({ type: "time" })
  closingTime!: string;

  @Column({ type: "tinyint", unsigned: true, default: 0 })
  taxPercent!: number;

  @Column({ type: "tinyint", unsigned: true, default: 0 })
  servicePercent!: number;
}
