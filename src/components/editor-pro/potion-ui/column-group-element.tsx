'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { PlateElement } from '@udecode/plate/react';

export function ColumnGroupElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  return (
    <PlateElement className={cn(className, 'mb-1')} {...props}>
      <div className={cn('flex size-full gap-4 rounded')}>{children}</div>
    </PlateElement>
  );
}
