import { exec, transaction } from '../utils/db';
import logger from '../utils/logger';
import { errCode } from '../errorCode';


export const getCategoryInfoByUuid = async (uuid: string): Promise<any> => {
  const result = { code: 200, message: 'success', data: {} };
  try {
    const sql = `
    SELECT 
      uuid,
      name,
      icon_file_uuid AS iconFileUuid,
      residence_uuid AS residenceUuid,
      category_type_id AS categoryTypeId,
      store_uuid AS storeUuid
    FROM
      categories
    WHERE 
      uuid = ? AND deleted_at IS NULL
    `;
    const rsp = await exec(sql, [uuid]);
    if (rsp.length) {
      result.data = rsp[0];
    }
  } catch (error) {
    logger.info('getCategoryInfoByUuid-err', JSON.stringify(error));
    result.code = errCode.CATCH_ERR;
    result.message = JSON.stringify(error);
  }
  return result;
};
