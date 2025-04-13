'use client';

import React from 'react';

import { BlockMenuPlugin } from '@udecode/plate-selection/react';
import { useEditorRef } from '@udecode/plate/react';
import { MoreHorizontal } from 'lucide-react';

import { useOpenState } from './dropdown-menu';
import { ToolbarButton } from './toolbar';

export function MoreDropdownMenu() {
  const editor = useEditorRef();
  const openState = useOpenState();

  return (
    <ToolbarButton
      onClick={(e) => {
        const blockAbove = editor.api.block()?.[0];

        if (!blockAbove) return;

        editor
          .getApi(BlockMenuPlugin)
          .blockMenu.showContextMenu(blockAbove.id as string, {
            x: e.clientX,
            y: e.clientY,
          });
      }}
      data-plate-prevent-overlay
      pressed={openState.open}
      tooltip="More"
    >
      <MoreHorizontal />
    </ToolbarButton>
  );
}
