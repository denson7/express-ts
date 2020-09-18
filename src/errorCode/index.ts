const errMsg = {
  200: 'Success',
  10000: 'Auth error, Please try again',
  60050: 'params error',
  60051: 'error',
  60052: 'insert failed',
  60053: 'update failed',
  60054: 'delete failed',
  60055: 'there are some products under the category, cannot be delete',
  60056: 'there is no records for this uuid',
  60057: 'this record is referenced by another record, cannot be deleted',
  60058: 'upload S3 failed, please try again!',
};

const errCode = {
  SUCCESS: 200,
  AUTH_ERROR: 10000,
  PARAMS_ERROR: 60050,
  CATCH_ERR: 60051,
  INSERT_ERR: 60052,
  UPDATE_ERR: 60053,
  DELETE_ERR: 60054,
  PRODUCT_UNDER_CATEGORY_ERR: 60055,
  NORECORD_ERR: 60056,
  REFERENCE_ERR: 60057,
  UPLOAD_S3_ERR: 60058,
};
export { errCode, errMsg };
