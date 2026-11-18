import { CategoryEntity } from "../category.entity";

export type CreateCategoryDataType = Pick<
  CategoryEntity,
  "name" | "description"
>;

export type UpdateCategoryDataType = Partial<
  Pick<CategoryEntity, "name" | "description" | "isActive">
>;
