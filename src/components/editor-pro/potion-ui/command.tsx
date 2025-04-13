'use client';

import * as React from 'react';

import type { DialogProps } from '@radix-ui/react-dialog';

import { cn, createPrimitiveElement, withCn, withVariants } from '@udecode/cn';
import { type VariantProps, cva } from 'class-variance-authority';
import { Command as CommandPrimitive } from 'cmdk';

import { Dialog, DialogContent, DialogTitle } from './dialog';
import { inputVariants } from './input';

const commandVariants = cva(
  'flex size-full flex-col rounded-md bg-popover text-popover-foreground focus-visible:outline-hidden',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        combobox: 'overflow-visible bg-transparent has-data-readonly:w-fit',
        default: 'overflow-hidden',
      },
    },
  }
);

export const Command = withVariants(CommandPrimitive, commandVariants, [
  'variant',
]);

export function CommandDialog({
  children,
  className,
  ...props
}: DialogProps & { className?: string }) {
  return (
    <Dialog {...props}>
      <DialogContent
        size="4xl"
        className="overflow-hidden p-0 shadow-lg"
        hideClose
      >
        <DialogTitle className="sr-only">Search</DialogTitle>

        <Command
          className={cn(
            '[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5',
            className
          )}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandInput({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> &
  VariantProps<typeof inputVariants>) {
  return (
    <div
      className="mt-2 flex w-full items-center px-3 py-1.5"
      cmdk-input-wrapper=""
    >
      <CommandPrimitive.Input
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    </div>
  );
}

export const CommandList = withCn(
  CommandPrimitive.List,
  'max-h-[500px] overflow-x-hidden overflow-y-auto py-1.5'
);

export const CommandEmpty = withCn(
  CommandPrimitive.Empty,
  'py-6 text-center text-sm'
);

export const CommandGroup = withCn(
  CommandPrimitive.Group,
  'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground'
);

export const CommandSeparator = withCn(
  CommandPrimitive.Separator,
  '-mx-1 h-px bg-border'
);

export const commandItemVariants = cva(
  'relative mx-1 flex h-[28px] cursor-default items-center rounded-sm px-2 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: '',
        menuItem: cn(
          'w-[calc(100%-8px)] min-w-56 px-2.5',
          'cursor-pointer text-accent-foreground no-focus-ring hover:bg-accent focus:bg-accent focus:text-accent-foreground'
        ),
      },
    },
  }
);

export const CommandItem = withVariants(
  CommandPrimitive.Item,
  commandItemVariants,
  ['variant']
);

export const CommandShortcut = withCn(
  createPrimitiveElement('span'),
  'ml-auto text-xs tracking-widest text-muted-foreground'
);
