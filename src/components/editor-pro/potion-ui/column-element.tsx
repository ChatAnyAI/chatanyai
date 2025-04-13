'use client';

import React from 'react';

import type { TColumnElement } from '@udecode/plate-layout';

import { cn } from '@udecode/cn';
import { ResizableProvider } from '@udecode/plate-resizable';
import {
  PlateElement,
  useElement,
  useReadOnly,
  withHOC,
} from '@udecode/plate/react';

export const ColumnElement = withHOC(
  ResizableProvider,
  function ColumnElement({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof PlateElement>) {
    const readOnly = useReadOnly();
    const { width } = useElement<TColumnElement>();

    return (
      <PlateElement
        className={cn(
          className,
          !readOnly && 'rounded-lg border border-dashed p-1.5'
        )}
        style={{ width: width ?? '100%' }}
        {...props}
      >
        {children}
      </PlateElement>
    );
  }
);
