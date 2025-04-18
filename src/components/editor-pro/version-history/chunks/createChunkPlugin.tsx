import type { Dispatch, SetStateAction } from 'react';

import type { PluginConfig } from '@udecode/plate';

import { createTPlatePlugin } from '@udecode/plate/react';

import { withGetFragmentExcludeProps } from '../diff';
import { ChunkElement } from './ChunkElement';

export type ChunkPluginConfig = PluginConfig<
  'chunk',
  {
    setExpandedChunks?: Dispatch<SetStateAction<number[]>>;
  }
>;

export const ChunkPlugin = createTPlatePlugin<ChunkPluginConfig>({
  key: 'chunk',
  options: {
    setExpandedChunks: () => {},
  },
  render: {
    aboveNodes: () => (injectProps) => <ChunkElement {...injectProps} />,
  },
}).overrideEditor(withGetFragmentExcludeProps('chunkCollapsed'));
