


export const trace = (l) => { console.log('[trace]', l); return l; };

export function deleteKeys(obj, deleteKey) {
  return Object.keys(obj)
    .filter(key => deleteKey.indexOf(key) === -1)
    .reduce((result, current) => {
      result[current] = obj[current];
      return result;
    }, {});
}



// FROM
// https://github.com/lodash/lodash/blob/master/.internal/baseRange.js

const nativeCeil = Math.ceil;
const nativeMax = Math.max;
const day = 24 * 3600 * 1000;

/**
 * The base implementation of `range` and `rangeRight` which doesn't
 * coerce arguments.
 *
 * @private
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @param {number} step The value to increment or decrement by.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Array} Returns the range of numbers.
 */
export function range(start, end, step = day, fromRight = false) {
  let index = -1;
  let length = nativeMax(nativeCeil((end - start) / (step || 1)), 0);
  const result = Array(length);

  while (length--) {
    result[fromRight ? length : ++index] = start;
    start += step;
  }
  return result;
}
