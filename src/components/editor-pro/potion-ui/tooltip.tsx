'use client';

import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { withCn, withProps } from '@udecode/cn';

import { useMounted } from '@/components/editor-pro/hooks/use-mounted';

export const TooltipProvider = withProps(TooltipPrimitive.Provider, {
  delayDuration: 200,
  disableHoverableContent: true,
  skipDelayDuration: 0,
});

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = withCn(
  withProps(TooltipPrimitive.Content, {
    sideOffset: 4,
  }),
  'z-9999 overflow-hidden rounded-md bg-primary px-2 py-1.5 text-xs font-semibold text-primary-foreground shadow-md'
);

export function TooltipTC({
  children,
  className,
  content,
  defaultOpen,
  delayDuration,
  disableHoverableContent,
  open,
  onOpenChange,
  ...props
}: {
  content: React.ReactNode;
} & React.ComponentProps<typeof TooltipPrimitive.Content> &
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>) {
  const mounted = useMounted();

  if (!mounted) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
        delayDuration={delayDuration}
        disableHoverableContent={disableHoverableContent}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>

        <TooltipPortal>
          <TooltipContent className={className} {...props}>
            {content}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

type TooltipProps<T extends React.ElementType> = {
  shortcut?: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    'children'
  >;
  tooltipProps?: Omit<
    React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
    'children'
  >;
  tooltipTriggerProps?: React.ComponentPropsWithoutRef<
    typeof TooltipPrimitive.Trigger
  >;
} & React.ComponentProps<T>;

export function withTooltip<T extends React.ElementType>(Component: T) {
  return function ExtendComponent({
    shortcut,
    tooltip,
    tooltipContentProps,
    tooltipProps,
    tooltipTriggerProps,
    ...props
  }: TooltipProps<T>) {
    const isMounted = useMounted();

    const component = <Component {...(props as React.ComponentProps<T>)} />;

    if (tooltip && isMounted) {
      return (
        <TooltipProvider>
          <Tooltip {...tooltipProps}>
            <TooltipTrigger asChild {...tooltipTriggerProps}>
              {component}
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent {...tooltipContentProps}>
                {tooltip}
                {shortcut && (
                  <div className="mt-px text-gray-400">{shortcut}</div>
                )}
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return component;
  };
}
