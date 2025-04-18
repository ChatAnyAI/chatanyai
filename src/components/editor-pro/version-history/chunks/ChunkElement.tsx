import React, { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@udecode/cn';
import {
  type PlateRenderElementProps,
  useEditorPlugin,
} from '@udecode/plate/react';

import type { ChunkCollapsedProps } from './types';

import { type ChunkPluginConfig, ChunkPlugin } from './createChunkPlugin';
import { ExpandChunkButton } from './ExpandChunkButton';

// eslint-disable-next-line unicorn/prefer-set-has
const mergeableProps: (keyof HTMLAttributes<HTMLElement>)[] = ['className'];

export const injectNodeProps = (
  children: ReactNode,
  props: HTMLAttributes<HTMLElement>
) =>
  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const { nodeProps } = child.props as PlateRenderElementProps;

      Object.keys(props).forEach((key) => {
        const exists = nodeProps && key in nodeProps;
        const mergeable = mergeableProps.includes(key as any);

        if (exists && !mergeable) {
          console.warn('injectNodeProps: Overwriting existing node prop', key);
        }
      });

      const newProps: Partial<PlateRenderElementProps> = {
        nodeProps: {
          ...nodeProps,
          ...props,
          className: cn(nodeProps?.className, props.className),
        },
      };

      return React.cloneElement(child, newProps);
    }

    return child;
  });

export const ChunkElement = (injectProps) => {
  const { getOptions } = useEditorPlugin<ChunkPluginConfig>(ChunkPlugin);

  const { children, element } = injectProps;

  if (!element.chunkCollapsed) return children;

  const { blockCount, chunkIndex, showExpandButton } =
    element.chunkCollapsed as ChunkCollapsedProps;

  const mappedChildren = injectNodeProps(children, { className: 'hidden' });

  return (
    <>
      {showExpandButton && (
        <ExpandChunkButton
          onClick={() =>
            getOptions().setExpandedChunks!((prev) => [...prev, chunkIndex])
          }
          blockCount={blockCount}
        />
      )}
      {mappedChildren}
    </>
  );
};
