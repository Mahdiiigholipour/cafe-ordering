export enum CategoriesMessages {
  // Name
  NAME_REQUIRED = "Category name is required.",
  NAME_MIN_LENGTH = "Category name must be at least 2 characters long.",
  NAME_MAX_LENGTH = "Category name must not exceed 100 characters.",
  NAME_ALREADY_EXISTS = "A category with this name already exists.",

  // Slug
  SLUG_REQUIRED = "Category slug is required.",
  SLUG_INVALID_FORMAT = "Category slug has an invalid format.",
  SLUG_MAX_LENGTH = "Category slug must not exceed 120 characters.",
  SLUG_ALREADY_EXISTS = "A category with this slug already exists.",

  // Description
  DESCRIPTION_MAX_LENGTH = "Category description must not exceed 500 characters.",

  // Image
  IMAGE_INVALID_FORMAT = "Category image has an unsupported format.",
  IMAGE_TOO_LARGE = "Category image exceeds the maximum allowed size.",

  // General
  CATEGORY_NOT_FOUND = "Category not found.",
  CATEGORY_ALREADY_EXISTS = "Category already exists.",

  // CRUD
  CATEGORY_CREATED = "Category created successfully.",
  CATEGORY_UPDATED = "Category updated successfully.",
  CATEGORY_DELETED = "Category deleted successfully.",
  CATEGORIES_RETRIEVED = "Categories retrieved successfully.",
  CATEGORY_RETRIEVED = "Category retrieved successfully.",

  // Status
  CATEGORY_ALREADY_ACTIVE = "Category is already active.",
  CATEGORY_ALREADY_INACTIVE = "Category is already inactive.",
  CATEGORY_ACTIVATED = "Category activated successfully.",
  CATEGORY_DEACTIVATED = "Category deactivated successfully.",

  // Protection
  CATEGORY_HAS_PRODUCTS = "Category cannot be deleted because it contains products.",
  CATEGORY_IN_USE = "Category cannot be deleted because it is currently in use.",
}
