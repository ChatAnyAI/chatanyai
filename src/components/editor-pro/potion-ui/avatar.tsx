'use client';

import * as React from 'react';

import type { AvatarImageProps } from '@radix-ui/react-avatar';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn, withVariants } from '@udecode/cn';
import { cva } from 'class-variance-authority';
// import Image from 'next/image';

const avatarVariants = cva('relative flex shrink-0 overflow-hidden', {
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: 'size-10',
      lg: 'size-12',
      profile: 'size-20',
      settings: 'size-20 md:size-28',
      sm: 'size-6',
    },
    variant: {
      default: 'rounded-full',
    },
  },
});

export const Avatar = withVariants(AvatarPrimitive.Root, avatarVariants, [
  'size',
  'variant',
]);

export function AvatarImage({
  className,
  onLoadingStatusChange,
  ...props
}: React.ComponentProps<typeof Image> &
  Pick<AvatarImageProps, 'onLoadingStatusChange'>) {
  return (
    <AvatarPrimitive.Image
      asChild
      onLoadingStatusChange={onLoadingStatusChange}
      src={props.src as string}
    >
      <img
        className={cn(
          'aspect-square size-full object-cover select-none',
          className
        )}
        // fill
        {...props}
        alt=""
      />
    </AvatarPrimitive.Image>
  );
}

const avatarFallbackVariants = cva(
  'box-content flex size-full items-center justify-center',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'rounded-full bg-muted',
      },
    },
  }
);

export const AvatarFallback = withVariants(
  AvatarPrimitive.Fallback,
  avatarFallbackVariants,
  ['variant']
);
