'use client';

import React from 'react';

import { AIChatPlugin } from '@udecode/plate-ai/react';
import { useEditorPlugin } from '@udecode/plate/react';

import { ToolbarButton } from './toolbar';

export function AIToolbarButton({
  children,
  ...rest
}: React.ComponentProps<typeof ToolbarButton>) {
  const { api } = useEditorPlugin(AIChatPlugin);

  return (
    <ToolbarButton
      {...rest}
      onClick={() => {
        api.aiChat.show();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </ToolbarButton>
  );
}
