import transform from "lodash/transform";
import snakeCase from "lodash/snakeCase";
import camelCase from "lodash/camelCase";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export const snakeCaseObject = (obj) => {
  return transform(obj, (acc, value, key, target) => {
    const snakeCaseKey = isArray(target) ? key : snakeCase(key);

    acc[snakeCaseKey] = isObject(value) ? snakeCaseObject(value) : value;
  });
};

export const camelCaseObject = (obj) => {
  return transform(obj, (acc, value, key, target) => {
    const camelCaseKey = isArray(target) ? key : camelCase(key);

    acc[camelCaseKey] = isObject(value) ? camelCaseObject(value) : value;
  });
};
