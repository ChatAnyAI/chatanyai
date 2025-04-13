'use client';

import React from 'react';

import {
  useEditorRef,
  useMarkToolbarButton,
  useMarkToolbarButtonState,
} from '@udecode/plate/react';

import { ToolbarButton } from './toolbar';

export function MarkToolbarButton({
  clear,
  nodeType,
  ...props
}: React.ComponentProps<typeof ToolbarButton> & {
  nodeType: string;
  clear?: string[] | string;
}) {
  const editor = useEditorRef();
  const state = useMarkToolbarButtonState({ clear, nodeType });
  const { props: buttonProps } = useMarkToolbarButton(state);

  return (
    <ToolbarButton
      {...buttonProps}
      {...props}
      onClick={() => {
        buttonProps.onClick?.();
        editor.tf.focus();
      }}
    />
  );
}
