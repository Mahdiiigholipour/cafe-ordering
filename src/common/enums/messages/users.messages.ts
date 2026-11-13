export enum UsersMessages {
  USERNAME_REQUIRED = "Username is required.",
  USERNAME_MAX_LENGTH = "Username must not exceed 32 characters.",
  USERNAME_INVALID_FORMAT = "Username can only contain lowercase letters, numbers, underscores, and dots.",
  USERNAME_ALREADY_EXISTS = "This username is already taken.",

  PASSWORD_MIN_LENGTH = "Password must be at least 8 characters long.",
  PASSWORD_MAX_LENGTH = "Password must not exceed 72 characters.",

  USER_CREATED = "User created successfully.",
  USER_NOT_FOUND = "User not found.",
  USER_UPDATED = "User updated successfully.",
  USER_DELETED = "User deleted successfully.",
  USER_PASSWORD_UPDATED = "User password updated successfully",

  CANNOT_MODIFY_SELF = "You cannot modify your own account.",
  CANNOT_DELETE_SELF = "You cannot delete your own account.",
  LAST_ADMIN_PROTECTED = "Cannot modify or remove the last active administrator.",

  UPDATE_EMPTY = "`role` or `isActive` is required",
}
