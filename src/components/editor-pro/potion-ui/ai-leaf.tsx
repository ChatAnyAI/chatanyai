'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate/react';

export function AILeaf({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateLeaf>) {
  return (
    <PlateLeaf
      className={cn(
        'border-b-2 border-b-brand/10 bg-brand/5 text-[rgb(17,96,174)]',
        'transition-all duration-200 ease-in-out',
        className
      )}
      {...props}
    >
      {children}
    </PlateLeaf>
  );
}
