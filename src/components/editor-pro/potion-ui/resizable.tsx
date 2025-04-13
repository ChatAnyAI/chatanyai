'use client';

import React from 'react';

import { cn, createPrimitiveElement, withVariants } from '@udecode/cn';
import {
  type ResizeHandle as ResizeHandlePrimitive,
  Resizable as ResizablePrimitive,
  useResizeHandle,
  useResizeHandleState,
} from '@udecode/plate-resizable';
import { cva } from 'class-variance-authority';

export const mediaResizeHandleVariants = cva(
  cn(
    'absolute inset-y-0 flex w-4 flex-col justify-center select-none',
    "after:flex after:h-12 after:max-h-[50%] after:w-1.5 after:rounded-[20px] after:opacity-0 after:transition-opacity after:duration-200 after:ease-in-out after:content-['_'] group-hover/media:after:opacity-100",
    'after:bg-opacity-[60] after:border after:border-white/90 after:bg-black/60'
  ),
  {
    variants: {
      direction: {
        left: 'left-0 pl-[5px]',
        right: 'right-0 items-end pr-[5px]',
      },
    },
  }
);

const resizeHandleVariants = cva(cn('absolute z-40'), {
  variants: {
    direction: {
      bottom: 'w-full cursor-row-resize',
      left: 'h-full cursor-col-resize',
      right: 'h-full cursor-col-resize',
      top: 'w-full cursor-row-resize',
    },
  },
});

const ResizeHandleVariants = withVariants(
  createPrimitiveElement('div'),
  resizeHandleVariants,
  ['direction']
);

export function ResizeHandle({
  options,
  ...props
}: React.ComponentProps<typeof ResizeHandlePrimitive>) {
  const state = useResizeHandleState(options ?? {});
  const resizeHandle = useResizeHandle(state);

  if (state.readOnly) return null;

  return (
    <ResizeHandleVariants
      data-resizing={state.isResizing}
      direction={options?.direction}
      {...resizeHandle.props}
      {...props}
    />
  );
}

const resizableVariants = cva('', {
  variants: {
    align: {
      center: 'mx-auto',
      left: 'mr-auto',
      right: 'ml-auto',
    },
  },
});

export const Resizable = withVariants(ResizablePrimitive, resizableVariants, [
  'align',
]);
