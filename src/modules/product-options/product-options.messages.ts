export const ProductOptionsMessages = {
  // General
  PRODUCT_OPTION_NOT_FOUND: "Product option not found.",

  // Validation
  NAME_REQUIRED: "Product option name is required.",
  NAME_TOO_LONG: "Product option name is too long.",
  PRICE_INVALID: "Product option price must be a valid non-negative number.",
  REMOVAL_OPTION_PRICE_NOT_ALLOWED: "Removal options cannot have a price",

  // Create
  PRODUCT_OPTION_CREATED: "Product option created successfully.",

  // Update
  PRODUCT_OPTION_UPDATED: "Product option updated successfully.",

  // Delete
  PRODUCT_OPTION_DELETED: "Product option deleted successfully.",

  // Relations
  PRODUCT_NOT_FOUND: "Product not found.",
  PRODUCT_OPTION_ALREADY_EXISTS: "Product option already exists.",
} as const;
