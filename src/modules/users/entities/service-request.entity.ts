import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AppBaseEntity } from "../../../common/entities/base.entity";
import { ServiceRequestStatus } from "../../../common/enums/service-request-status.enum";
import { ServiceRequestTypes } from "../../../common/enums/service-request-types.enum";
import { TableEntity } from "../../tables/table.entity";

@Entity("service_requests")
@Index(["status", "createdAt"])
export class ServiceRequestEntity extends AppBaseEntity {
  @Column({ type: "enum", enum: ServiceRequestTypes })
  type!: ServiceRequestTypes;

  @Column({
    type: "enum",
    enum: ServiceRequestStatus,
    default: ServiceRequestStatus.Pending,
  })
  status!: ServiceRequestStatus;

  @Column({ type: "datetime", nullable: true })
  resolvedAt!: Date | null;

  @Column({ type: "varchar", length: 36 })
  tableId!: string;

  @ManyToOne(() => TableEntity, { onDelete: "RESTRICT", nullable: false })
  @JoinColumn({ name: "table_id" })
  table?: TableEntity;
}
