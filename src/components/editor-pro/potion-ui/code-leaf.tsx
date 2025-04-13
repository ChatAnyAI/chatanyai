'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { PlateLeaf } from '@udecode/plate/react';

export function CodeLeaf({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateLeaf>) {
  return (
    <PlateLeaf
      asChild
      className={cn(
        'rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm whitespace-pre-wrap',
        className
      )}
      {...props}
    >
      <code>{children}</code>
    </PlateLeaf>
  );
}
