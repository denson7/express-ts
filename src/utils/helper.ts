import fs, { promises as fsPromise } from 'fs';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import useragent from 'express-useragent';
import path from 'path';
import multer from 'multer';
import moment from 'moment';
import logger from './logger';

export const uploads = multer({
  storage: multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, 'uploads/');
    // },
    filename: function (req, file, cb) {
      // cb(null, file.originalname);
      const uniqueName = randomBytes(5).toString('hex');
      cb(null, uniqueName + path.extname(file.originalname));
    },
  }),
  // limits: {
  //   fileSize: 5 * 1024 * 1024,
  // },
  // fileFilter(req, file, cb) {
  //   if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // },
});

export const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDirectory = 'uploads/';
      if (!fs.existsSync(uploadDirectory)) {
        await fsPromise.mkdir(uploadDirectory);
      }
      cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
      const uniqueName = randomBytes(18).toString('hex');
      cb(null, uniqueName + path.extname(file.originalname));
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const checkIsMobileRequest = (req: Request): boolean => {
  const source = req.headers['user-agent'];
  const ua = useragent.parse(source);
  logger.info('UA:', JSON.stringify(ua));
  return ua.isMobile || false;
};

export const sum = (arr: number[]): number => {
  return arr.reduce((prev, next) => {
    return prev + next;
  });
};

export const getObjKeyAndValues = (obj: Record<string, any>): { columns: any; values: any } => {
  return {
    columns: Object.keys(obj),
    values: Object.values(obj),
  };
};

// check is array
export const isArray = (arg: any) => {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]';
  }
  return Array.isArray(arg);
};

// multi-dimensional arrays to one dimensional array
export const flattenArray = (arr: any[]) => {
  return arr.reduce((prev, item) => {
    return prev.concat(Array.isArray(item) ? flattenArray(item) : item);
  }, []);
};

// unique object array by object's key
// const demo = [{key: '1', value: '11'}, {key: '2', value: '22'}, key: '1', value: '11'}]
export const uniqueObjByKey = (arr: any[], key) => {
  const obj = {};
  arr = arr.reduce((item, next) => {
    obj[next[key]] ? '' : (obj[next[key]] = true && item.push(next));
    return item;
  }, []);
  return arr;
};

// compare array or object is equal
export const isEqual = (value: any, other: any) => {
  const type = Object.prototype.toString.call(value);
  if (type !== Object.prototype.toString.call(other)) {
    return false;
  }
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
    return false;
  }
  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) {
    return false;
  }

  const compare = (item1, item2) => {
    const itemType = Object.prototype.toString.call(item1);
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) {
        return false;
      }
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) {
        return false;
      }
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) {
          return false;
        }
      } else {
        if (item1 !== item2) {
          return false;
        }
      }
    }
  };
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) {
        return false;
      }
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) {
          return false;
        }
      }
    }
  }
  return true;
};

// unique object, compare every key
export const uniqueObjArray = (array: Record<string, any>[]): Record<string, any>[] => {
  const newArr = [array[0]];
  for (let i = 1; i < array.length; i++) {
    let isIn = false;
    for (let j = 0; j < newArr.length; j++) {
      // check is equal two object
      if (isEqual(array[i], newArr[j])) {
        isIn = true;
        break;
      }
    }
    if (!isIn) {
      newArr.push(array[i]);
    }
  }
  return newArr;
};

// check is JSON string
export const isJSON = (str: string): boolean => {
  let flag = false;
  if (typeof str == 'string') {
    try {
      const obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        flag = true;
      }
    } catch (e) {
      flag = false;
    }
  }
  return flag;
};

// remove space
export const trimObj = (obj: {}) => {
  return JSON.parse(JSON.stringify(obj), (key, value) => {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  });
};

export const pick = (obj = {}, keys = []) => {
  return Object.keys(obj).reduce((t, v) => (keys.includes(v) && (t[v] = obj[v]), t), {});
};

export const omit = (obj = {}, keys = []) => {
  return Object.keys(obj)
    .filter((k) => !keys.includes(k))
    .reduce((res, k) => Object.assign(res, { [k]: obj[k] }), {});
};

// array union
export const union2Arr = (a: any[], b: any[]) => {
  return a.concat(b.filter((v) => !a.includes(v)));
};
// array intersection
export const inter2Arr = (a, b) => {
  return a.filter((v) => b.includes(v));
};
// array difference
export const diff2Arr = (a, b) => {
  return a.concat(b).filter((v) => a.includes(v) && !b.includes(v));
};

export const isObj = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

// unique arr
export const uniqueArr = (arr: string[]) => {
  return Array.from(new Set(arr));
};

/**
 *
 * @param start 2020-06-18 16:18:00
 * @param end 2020-06-18 16:18:11
 */
export const diffTime = (start: string, end: string): number => {
  const _start = moment(start);
  const _end = moment(end);
  const diffTime = _end.diff(_start);
  return diffTime / 1000; // seconds
};