'use client';

import { BlockMenuPlugin } from '@udecode/plate-selection/react';

import { BlockContextMenu } from '@/components/editor-pro/potion-ui/block-context-menu';

import { blockSelectionPlugin } from './block-selection-plugin';

export const blockMenuPlugins = [
  blockSelectionPlugin,
  BlockMenuPlugin.configure({
    render: { aboveEditable: BlockContextMenu },
  }),
] as const;
