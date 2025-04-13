'use client';

import React from 'react';

import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from '@udecode/plate-link/react';
import { Link } from 'lucide-react';

import { ToolbarButton } from './toolbar';

export function LinkToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const state = useLinkToolbarButtonState();
  const { props: buttonProps } = useLinkToolbarButton(state);

  return (
    <ToolbarButton data-plate-focus tooltip="Link" {...buttonProps} {...props}>
      <Link />
    </ToolbarButton>
  );
}
