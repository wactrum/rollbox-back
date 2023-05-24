export enum Permission {
  VIEW_USER = 'users.view',
  VIEW_USERS = 'users.viewAll',
  CREATE_USER = 'users.create',
  USER_UPDATE = 'users.update',
  USER_DELETE = 'users.delete',

  VIEW_ROLES = 'roles.viewAll',
  VIEW_ROLE = 'roles.view',
  CREATE_ROLE = 'roles.create',
  UPDATE_ROLE = 'roles.update',
  DELETE_ROLE = 'roles.delete',

  EDIT_USER_ROLES = 'edit.user.roles',

  VIEW_DELIVERY_LOCATIONS = 'delivery-locations.viewAll',
  VIEW_DELIVERY_LOCATION = 'delivery-locations.view',
  UPDATE_DELIVERY_LOCATIONS = 'delivery-locations.update',
  DELETE_DELIVERY_LOCATIONS = 'delivery-locations.delete',

  CREATE_CATEGORY = 'category.create',
  UPDATE_CATEGORY = 'category.update',
  DELETE_CATEGORY = 'category.delete',

  CREATE_PRODUCTS = 'products.create',
  UPDATE_PRODUCT = 'products.update',
  DELETE_PRODUCT = 'products.delete',
  VIEW_DELETED_PRODUCTS = 'products.viewDeleted',

  VIEW_ORDERS = 'orders.viewAll',
  VIEW_ORDER = 'orders.view',
  UPDATE_ORDER = 'orders.update',
  DELETE_ORDER = 'orders.delete',

  VIEW_ADMIN_PAGE = 'view.admin.page',
}
