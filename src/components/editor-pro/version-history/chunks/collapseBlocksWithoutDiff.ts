import type { Value } from '@udecode/plate';

import type { ChunkCollapsedProps } from './types';

import { hasDiff } from '../diff/hasDiff';
import { chunkDiffs } from './chunkDiffs';

export interface CollapseBlocksWithoutDiffOptions {
  expandedChunks: number[];
}

export const collapseBlocksWithoutDiff = (
  value: Value,
  { expandedChunks }: CollapseBlocksWithoutDiffOptions
) => {
  const diffChunks = chunkDiffs(value, {
    hasDiff,
    paddingBlocks: 1,
  });

  const collapsedValue = diffChunks.flatMap(
    ({ blocks, hasDiff }, chunkIndex) =>
      hasDiff || expandedChunks.includes(chunkIndex)
        ? blocks
        : blocks.map((block, blockIndex) => ({
            ...block,
            chunkCollapsed: {
              blockCount: blocks.length,
              chunkIndex,
              showExpandButton: blockIndex === 0,
            } satisfies ChunkCollapsedProps,
          }))
  );

  return collapsedValue;
};
