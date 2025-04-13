'use client';

import React from 'react';

import type { TLinkElement } from '@udecode/plate-link';

import { cn } from '@udecode/cn';
import { useLink } from '@udecode/plate-link/react';
import { PlateElement, useElement } from '@udecode/plate/react';

export function LinkElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const element = useElement<TLinkElement>();
  const { props: linkProps } = useLink({ element });

  return (
    <PlateElement
      as="a"
      className={cn(
        'font-medium text-primary underline decoration-primary underline-offset-4',
        className
      )}
      {...(linkProps as any)}
      {...props}
    >
      {children}
    </PlateElement>
  );
}
