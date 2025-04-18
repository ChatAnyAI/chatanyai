export type Chunk<Block> = ChunkWithDiff<Block> | ChunkWithoutDiff<Block>;

export interface ChunkDiffOptions<Block> {
  paddingBlocks: number;
  hasDiff: (block: Block) => boolean;
}

export type ChunkWithDiff<Block> = {
  blocks: Block[];
  hasDiff: true;
};

export type ChunkWithoutDiff<Block> = {
  blocks: Block[];
  hasDiff: false;
};

export const chunkDiffs = <Block>(
  blocks: Block[],
  { hasDiff, paddingBlocks }: ChunkDiffOptions<Block>
): Chunk<Block>[] => {
  const chunks: Chunk<Block>[] = [];

  let pendingChunkBlocks: Block[] = [];
  let pendingChunkHasDiff: boolean | null = null;

  let remainingPaddingBelowBlocks = 0;

  const commitPendingChunk = () => {
    if (pendingChunkBlocks.length > 0) {
      /**
       * If the last chunk has the same hasDiff value, merge it with the current
       * chunk. Otherwise, create a new chunk.
       */
      const chunkHasDiff = pendingChunkHasDiff ?? false;
      const lastChunk = chunks.at(-1);
      const lastChunkHasDiff = lastChunk?.hasDiff ?? null;
      const mergeWithLastChunk = chunkHasDiff === lastChunkHasDiff;

      if (mergeWithLastChunk) {
        lastChunk?.blocks.push(...pendingChunkBlocks);
      } else {
        chunks.push({
          blocks: pendingChunkBlocks,
          hasDiff: pendingChunkHasDiff ?? false,
        });
      }

      pendingChunkBlocks = [];
      pendingChunkHasDiff = null;
    }
  };

  blocks.forEach((block) => {
    const blockHasDiff = hasDiff(block);

    // Reset the padding below counter if the current block has a diff
    if (blockHasDiff) {
      remainingPaddingBelowBlocks = paddingBlocks;
    }
    // Determine what to do with the pending chunk
    if (pendingChunkBlocks.length > 0) {
      if (blockHasDiff && !pendingChunkHasDiff) {
        /**
         * Start a new diff chunk, moving paddingBlocks from the old pending
         * chunk to the new pending chunk.
         */
        const blocksToMove = pendingChunkBlocks.splice(-paddingBlocks);
        commitPendingChunk();
        pendingChunkBlocks = blocksToMove;
        pendingChunkHasDiff = true;
      } else if (
        !blockHasDiff &&
        pendingChunkHasDiff &&
        // Only end the diff chunk if there are no more padding blocks
        remainingPaddingBelowBlocks-- === 0
      ) {
        commitPendingChunk();
      }
    }

    pendingChunkBlocks.push(block);

    if (pendingChunkHasDiff === null) {
      pendingChunkHasDiff = blockHasDiff;
    }
  });

  commitPendingChunk();

  return chunks;
};
