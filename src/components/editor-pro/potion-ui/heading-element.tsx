'use client';

import React from 'react';

import { withVariants } from '@udecode/cn';
import { PlateElement } from '@udecode/plate/react';
import { cva } from 'class-variance-authority';

const headingVariants = cva(
  'relative mb-1 px-0.5 py-[3px] leading-[1.3]! font-semibold',
  {
    variants: {
      variant: {
        h1: 'mt-8 text-[1.875em]',
        h2: 'mt-[1.4em] text-[1.5em]',
        h3: 'mt-[1em] text-[1.25em]',
      },
    },
  }
);

const HeadingElementVariants = withVariants(PlateElement, headingVariants, [
  'variant',
]);

export function HeadingElement({
  children,
  element,
  variant = 'h1',
  ...props
}: React.ComponentProps<typeof HeadingElementVariants> & {
  variant?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <HeadingElementVariants
      id={element?.id as string}
      as={variant}
      variant={variant}
      element={element}
      {...props}
    >
      {children}
    </HeadingElementVariants>
  );
}
