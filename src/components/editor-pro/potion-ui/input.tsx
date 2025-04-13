'use client';

import type * as React from 'react';

import { cn, withVariants } from '@udecode/cn';
import { cva } from 'class-variance-authority';

export type InputProps = React.ComponentProps<typeof Input>;

export const inputVariants = cva(
  cn(
    'flex w-full rounded-md text-base outline-hidden file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
    'h-[28px] border-[1.5px] border-input bg-muted/80 px-1.5 placeholder:text-muted-foreground/80',
    'read-only:ring-0 read-only:focus:border-input'
  ),
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'focus:border-brand/50 focus:ring-2 focus:ring-brand/30',
        flat: '',
        link: 'border-none bg-transparent',
        search: 'border-none bg-transparent text-lg',
      },
    },
  }
);

export const Input = withVariants('input', inputVariants, ['variant']);
