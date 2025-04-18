import React from 'react';

export interface ExpandChunkButtonProps {
  blockCount: number;
  onClick: () => void;
}

export const ExpandChunkButton = ({
  blockCount,
  onClick,
}: ExpandChunkButtonProps) => {
  return (
    <button onClick={onClick} type="button">
      View {blockCount} more
    </button>
  );
};
