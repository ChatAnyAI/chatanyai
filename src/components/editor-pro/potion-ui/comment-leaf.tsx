'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { type TCommentText, getCommentCount } from '@udecode/plate-comments';
import {
  type PlateLeafProps,
  PlateLeaf,
  useEditorPlugin,
  usePluginOption,
} from '@udecode/plate/react';

import { ExtendedCommentsPlugin } from '@/components/editor-pro/components/editor/plugins/comments/ExtendedCommentsPlugin';

export function CommentLeaf({
  className,
  ...props
}: PlateLeafProps<TCommentText>) {
  const { children, leaf, nodeProps } = props;

  const { api, setOption } = useEditorPlugin(ExtendedCommentsPlugin);
  const hoverId = usePluginOption(ExtendedCommentsPlugin, 'hoverId');
  const activeId = usePluginOption(ExtendedCommentsPlugin, 'activeId');

  const isOverlapping = getCommentCount(leaf) > 1;
  const currentId = api.comment.nodeId(leaf);
  const isActive = activeId === currentId;
  const isHover = hoverId === currentId;

  return (
    <PlateLeaf
      {...props}
      className={cn(
        'border-b-2 border-b-highlight/[.36] bg-highlight/[.13] transition-colors duration-200',
        (isHover || isActive) && 'border-b-highlight bg-highlight/25',
        isOverlapping && 'border-b-2 border-b-highlight/[.7] bg-highlight/25',
        (isHover || isActive) &&
          isOverlapping &&
          'border-b-highlight bg-highlight/45',
        className
      )}
      onClick={() => setOption('activeId', currentId ?? null)}
      onMouseEnter={() => setOption('hoverId', currentId ?? null)}
      onMouseLeave={() => setOption('hoverId', null)}
      nodeProps={{
        ...nodeProps,
      }}
    >
      {children}
    </PlateLeaf>
  );
}
