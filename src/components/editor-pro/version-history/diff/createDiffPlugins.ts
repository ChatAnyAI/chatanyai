import { createTPlatePlugin } from '@udecode/plate/react';

import { DiffElement } from './DiffElement';
import { DiffLeaf } from './DiffLeaf';
import { withGetFragmentExcludeProps } from './withGetFragmentExcludeProps';

const MARK_DIFF = 'diff';

export const DiffPlugin = createTPlatePlugin({
  key: MARK_DIFF,
  node: { component: DiffLeaf, isLeaf: true },
  render: {
    aboveNodes: () => DiffElement,
  },
}).overrideEditor(withGetFragmentExcludeProps('diff', 'diffOperation'));
