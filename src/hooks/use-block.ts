'use client';

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';

export const initialBlockData: any = {
  documentId: 'init',
  content: '',
  kind: 'text',
  title: '',
  status: 'idle',
  isVisible: false,
  boundingBox: {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  },
};

// Add type for selector function
type Selector<T> = (state: any) => T;

export function useBlockSelector<Selected>(selector: Selector<Selected>) {
  const { data: localBlock } = useSWR<any>('block', null, {
    fallbackData: initialBlockData,
  });

  const selectedValue = useMemo(() => {
    if (!localBlock) return selector(initialBlockData);
    return selector(localBlock);
  }, [localBlock, selector]);

  return selectedValue;
}

export function useBlock() {
  const { data: localBlock, mutate: setLocalBlock } = useSWR<any>(
    'block',
    null,
    {
      fallbackData: initialBlockData,
    },
  );

  const block = useMemo(() => {
    if (!localBlock) return initialBlockData;
    return localBlock;
  }, [localBlock]);

  const setBlock = useCallback(
    (updaterFn: any | ((currentBlock: any) => any)) => {
      setLocalBlock((currentBlock: any) => {
        const blockToUpdate = currentBlock || initialBlockData;

        if (typeof updaterFn === 'function') {
          return updaterFn(blockToUpdate);
        }

        return updaterFn;
      });
    },
    [setLocalBlock],
  );

  return useMemo(() => ({ block, setBlock }), [block, setBlock]);
}
