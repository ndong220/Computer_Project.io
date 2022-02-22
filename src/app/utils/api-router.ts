export const authenticationRouter = {
  getToken: `api/v1/authentication/jwt/login`,
};
export const navigationRouter = {
  getNavigationOwner: `api/v1/bsd/navigations/owner`,
};

export const nodeUploadRouter = {
  uploadFileBlobPhysical: `api/v1/core/nodes/upload/physical/blob`,
};
export const socialAuthenticationRouter = {
  authenticate: `api/v1/social-authentication?_allow_anonymous=true`,
};
export const unitRouter = {
  create: `api/v1/res/unit`,
  createMany: `api/v1/res/unit/create-many`,
  update: `api/v1/res/unit`,
  delete: `api/v1/res/unit`,
  getById: `api/v1/res/unit?id=`,
  getFilter: `api/v1/res/unit/filter`,
  getAll: `api/v1/res/unit/all`,
  getListCombobox: `api/v1/res/unit/for-combobox`,
};
export const categoryRouter = {
  create: `api/v1/computer-management/category`,
  createMany: `api/v1/computer-management/category/create-many`,
  update: `api/v1/computer-management/category`,
  delete: `api/v1/computer-management/category`,
  getById: `api/v1/computer-management/category?id=`,
  getFilter: `api/v1/computer-management/category/filter`,
  getAll: `api/v1/computer-management/category/all`,
  getListCombobox: `api/v1/computer-management/category/for-combobox`,
};
export const categoryMetaRouter = {
  create: `api/v1/computer-management/category-meta`,
  createMany: `api/v1/computer-management/category-meta/create-many`,
  update: `api/v1/computer-management/category-meta`,
  delete: `api/v1/computer-management/category-meta`,
  getById: `api/v1/computer-management/category-meta?id=`,
  getFilter: `api/v1/computer-management/category-meta/filter`,
  getAll: `api/v1/computer-management/category-meta/all`,
  getListCombobox: `api/v1/computer-management/category-meta/for-combobox`,
};
export const tagRouter = {
  create: `api/v1/computer-management/tag`,
  createMany: `api/v1/computer-management/tag/create-many`,
  update: `api/v1/computer-management/tag`,
  delete: `api/v1/computer-management/tag`,
  getById: `api/v1/computer-management/tag?id=`,
  getFilter: `api/v1/computer-management/tag/filter`,
  getAll: `api/v1/computer-management/tag/all`,
  getListCombobox: `api/v1/computer-management/tag/for-combobox`,
};
export const supplierRouter = {
  create: `api/v1/computer-management/supplier`,
  createMany: `api/v1/computer-management/supplier/create-many`,
  update: `api/v1/computer-management/supplier`,
  delete: `api/v1/computer-management/supplier`,
  getById: `api/v1/computer-management/supplier?id=`,
  getFilter: `api/v1/computer-management/supplier/filter`,
  getAll: `api/v1/computer-management/supplier/all`,
  getListCombobox: `api/v1/computer-management/supplier/for-combobox`,
};
export const voucherRouter = {
  create: `api/v1/computer-management/voucher`,
  createMany: `api/v1/computer-management/voucher/create-many`,
  update: `api/v1/computer-management/voucher`,
  delete: `api/v1/computer-management/voucher`,
  getById: `api/v1/computer-management/voucher?id=`,
  getFilter: `api/v1/computer-management/voucher/filter`,
  getAll: `api/v1/computer-management/voucher/all`,
  getListCombobox: `api/v1/computer-management/voucher/for-combobox`,
};
export const baseAddressRouter = {
  city: `api/v1/address/city`,
  district: `api/v1/address/district?matp=`,
  commune: `api/v1/address/commune?maqh=`,
};
export const notifyRouter = {
  getAll: `api/v1/computer-management/notification`,
  update: `api/v1/computer-management/notification/update`,
};
export const dashboardRouter = {
  getAll: `api/v1/dashboard`,
  update: `api/v1/dashboard/update-visit`,
  getRpMonthYear: `api/v1/dashboard/report-month-in-year`,
};
export const moneyRouter = {
  getRate: 'api/v7/convert?q=',
};
export const productRouter = {
  create: `api/v1/computer-management/product`,
  createMany: `api/v1/computer-management/product/create-many`,
  update: `api/v1/computer-management/product`,
  delete: `api/v1/computer-management/product`,
  getById: `api/v1/computer-management/product?id=`,
  getByCode: `api/v1/computer-management/product/code`,
  getListSimilar: `api/v1/computer-management/product/similar`,
  getFilter: `api/v1/computer-management/product/filter`,
  getAll: `api/v1/computer-management/product/all`,
  getListCombobox: `api/v1/computer-management/product/for-combobox`,
  getProdBySupplier: `api/v1/computer-management/product/product-by-supplier`,
  updateVisitCount: `api/v1/computer-management/product/update-visit-count`,
};

export const orderRouter = {
  create: `api/v1/computer-management/order`,
  createMany: `api/v1/computer-management/order/create-many`,
  update: `api/v1/computer-management/order`,
  updateStatusOrder: `api/v1/computer-management/order/update-status`,
  delete: `api/v1/computer-management/order`,
  getById: `api/v1/computer-management/order?id=`,
  getFilter: `api/v1/computer-management/order/filter`,
  getAll: `api/v1/computer-management/order/all`,
  getListCombobox: `api/v1/computer-management/order/for-combobox`,
};
export const cartRouter = {
  create: `api/v1/computer-management/cart`,
  createMany: `api/v1/computer-management/cart/create-many`,
  update: `api/v1/computer-management/cart`,
  delete: `api/v1/computer-management/cart`,
  getById: `api/v1/computer-management/cart/get-by-user-id`,
  getFilter: `api/v1/computer-management/cart/filter`,
  getAll: `api/v1/computer-management/cart/all`,
  getListCombobox: `api/v1/computer-management/cart/for-combobox`,
};
export const customerRouter = {
  create: `api/v1/computer-management/customer`,
  createMany: `api/v1/computer-management/customer/create-many`,
  update: `api/v1/computer-management/customer`,
  updateVoucher: `api/v1/computer-management/customer/update-voucher`,
  delete: `api/v1/computer-management/customer`,
  changeQtv: `api/v1/computer-management/customer/change-role`,
  getById: `api/v1/computer-management/customer?id=`,
  getFilter: `api/v1/computer-management/customer/filter`,
  getAll: `api/v1/computer-management/customer/all`,
  getListCombobox: `api/v1/computer-management/customer/for-combobox`,
  getToken: `api/v1/authentication/jwt/user/login`,
  loginWithGoogle: `api/v1/authentication/jwt/google/login`,
  register: `api/v1/account/create`,
  forgotPassword: `api/v1/computer-management/customer/forgot-password`,
  changePassword: `api/v1/computer-management/customer/update-password`,
};
export const productReviewRouter = {
  create: `api/v1/computer-management/productReview`,
  createMany: `api/v1/computer-management/productReview/create-many`,
  update: `api/v1/computer-management/productReview`,
  delete: `api/v1/computer-management/productReview`,
  getById: `api/v1/computer-management/productReview?id=`,
  getFilter: `api/v1/computer-management/productReview/filter`,
  getAll: `api/v1/computer-management/productReview/all`,
  getListCombobox: `api/v1/computer-management/productReview/for-combobox`,
};
export const categoryMetaProductRouter = {
  create: `api/v1/computer-management/category-meta-product`,
  createMany: `api/v1/computer-management/category-meta-product/create-many`,
  update: `api/v1/computer-management/category-meta-product`,
  delete: `api/v1/computer-management/category-meta-product`,
  getById: `api/v1/computer-management/category-meta-product?id=`,
  getFilter: `api/v1/computer-management/category-meta-product/filter`,
  getAll: `api/v1/computer-management/category-meta-product/all`,
  getListCombobox: `api/v1/computer-management/category-meta-product/for-combobox`,
};
export const userRouter = {
  getListRightOfUser: `api/v1/idm/users`,
  getListRoleOfUser: `api/v1/idm/users`,
  changePassword: `api/v1/idm/users/changepassword`,
  create: `api/v1/idm/users`,
};
