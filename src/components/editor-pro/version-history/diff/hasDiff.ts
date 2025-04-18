import { type Descendant, ElementApi } from '@udecode/plate';

export const hasDiff = (descendant: Descendant): boolean =>
  'diff' in descendant ||
  (ElementApi.isElement(descendant) && descendant.children.some(hasDiff));
