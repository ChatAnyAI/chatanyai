import type { OverrideEditor } from '@udecode/plate/react';

import { type Descendant, ElementApi } from '@udecode/plate';

export const withGetFragmentExcludeProps =
  (...propNames: string[]): OverrideEditor =>
  ({ api: { getFragment } }) => ({
    api: {
      getFragment() {
        const fragment = structuredClone(getFragment());

        const removeDiff = (node: Descendant) => {
          propNames.forEach((propName) => {
            delete node[propName];
          });

          if (ElementApi.isElement(node)) node.children.forEach(removeDiff);
        };

        fragment.forEach(removeDiff);

        return fragment as any;
      },
    },
  });
