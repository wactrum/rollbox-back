export enum Permission {
  VIEW_USER = "users.view",
  VIEW_USERS = "users.viewAll",
  CREATE_USER = "users.create",
  USER_UPDATE = "users.update",
  USER_DELETE = "users.delete",

  VIEW_ROLES = "roles.viewAll",
  VIEW_ROLE = "roles.view",
  CREATE_ROLE = "roles.create",
  UPDATE_ROLE = "roles.update",
  DELETE_ROLE = "roles.delete",

  EDIT_USER_ROLES = 'edit.user.roles',

  VIEW_PROJECTS = "projects.viewAll",

  VIEW_SUBSCRIPTIONS = "subscriptions.viewAll",
  VIEW_SUBSCRIPTION = "subscriptions.view"
}