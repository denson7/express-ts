interface IArrayHelper {
  chunkArray: (a: any, b: number) => {};
}

interface IStringHelper {
  toUpperCaseFields: (obj: Record<string, any>, fields: any) => {};
}

const arrayHelper: IArrayHelper = {
  chunkArray: (array, chunk_size) => {
    const results = [];
    while (array.length) {
      results.push(array.splice(0, chunk_size));
    }

    return results;
  },
};

const stringHelper: IStringHelper = {
  toUpperCaseFields: (object, fields = []) => {
    fields.forEach((field) => {
      if (object[field]) object[field] = object[field].toUpperCase();
    });
    return object;
  },
};

export { arrayHelper, stringHelper };
