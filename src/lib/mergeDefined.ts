import { isDefined, isUndefined } from '@udecode/plate';
import { isArray, isNil, mergeWith, omitBy } from 'lodash';

export const mergeDefined = <TSource1, TSource2>(
  source1: TSource1,
  source2: TSource2,
  {
    mergeArrays = false,
    omitNull,
  }: { mergeArrays?: boolean; omitNull?: boolean } = {}
) => {
  let merged = mergeWith<{}, TSource1, TSource2>(
    {},
    source1,
    source2,
    (a, b) => {
      if ((!omitNull && !isDefined(a)) || (omitNull && isUndefined(a))) {
        return b;
      }
      if (isArray(a) && isArray(b)) {
        return mergeArrays ? a.concat(b) : b;
      }

      return a;
    }
  );

  merged = omitBy(merged, omitNull ? isUndefined : isNil) as any;

  return merged;
};
