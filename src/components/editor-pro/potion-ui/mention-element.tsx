'use client';

import React from 'react';

import type { TMentionElement } from '@udecode/plate-mention';

import { cn } from '@udecode/cn';
import { getHandler, IS_APPLE } from '@udecode/plate';
import {
  PlateElement,
  useElement,
  useFocused,
  useSelected,
} from '@udecode/plate/react';

import { useMounted } from '@/components/editor-pro/hooks/use-mounted';

export function MentionElement({
  className,
  prefix,
  renderLabel,
  onClick,
  ...props
}: React.ComponentProps<typeof PlateElement> & {
  prefix?: string;
  renderLabel?: (mentionable: TMentionElement) => string;
  onClick?: (mentionNode: any) => void;
}) {
  const { children } = props;
  const element = useElement<TMentionElement>();
  const selected = useSelected();
  const focused = useFocused();
  const mounted = useMounted();

  return (
    <PlateElement
      className={cn(
        'inline-block cursor-pointer rounded-md bg-muted px-1.5 py-0.5 align-baseline text-sm font-medium',
        selected && focused && 'ring-2 ring-ring',
        element.children[0].bold === true && 'font-bold',
        element.children[0].italic === true && 'italic',
        element.children[0].underline === true && 'underline',
        className
      )}
      onClick={getHandler(onClick, element)}
      data-slate-value={element.value}
      contentEditable={false}
      draggable
      {...props}
    >
      {mounted && IS_APPLE ? (
        <React.Fragment>
          {children}
          {prefix}
          {renderLabel ? renderLabel(element) : element.value}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {prefix}
          {renderLabel ? renderLabel(element) : element.value}
          {children}
        </React.Fragment>
      )}
    </PlateElement>
  );
}
