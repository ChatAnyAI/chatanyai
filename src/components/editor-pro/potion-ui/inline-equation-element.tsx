'use client';

import { useRef, useState } from 'react';

import type { TEquationElement } from '@udecode/plate-math';

import { cn } from '@udecode/cn';
import { useEquationElement } from '@udecode/plate-math/react';
import { PlateElement, useElement } from '@udecode/plate/react';
import { RadicalIcon } from 'lucide-react';

import { EquationPopoverContent } from './equation-popover';
import { Popover, PopoverTrigger } from './popover';

export function InlineEquationElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const element = useElement<TEquationElement>();
  const katexRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEquationElement({
    element,
    katexRef: katexRef,
    options: {
      displayMode: true,
      errorColor: '#cc0000',
      fleqn: false,
      leqno: false,
      macros: { '\\f': '#1f(#2)' },
      output: 'htmlAndMathml',
      strict: 'warn',
      throwOnError: false,
      trust: false,
    },
  });

  return (
    <PlateElement
      className={cn(
        'inline-block rounded-sm select-none [&_.katex-display]:my-0',
        className
      )}
      {...props}
    >
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              'after:absolute after:inset-0 after:-top-0.5 after:-left-1 after:z-1 after:h-[calc(100%)+4px] after:w-[calc(100%+8px)] after:rounded-sm after:content-[""]',
              'h-6',
              element.texExpression.length > 0 && open && 'after:bg-brand/15',
              element.texExpression.length === 0 &&
                'text-muted-foreground after:bg-neutral-500/10',
              className
            )}
            contentEditable={false}
          >
            <span
              ref={katexRef}
              className={cn(
                element.texExpression.length === 0 && 'hidden',
                'font-mono leading-none'
              )}
            />
            {element.texExpression.length === 0 && (
              <span>
                <RadicalIcon className="mr-1 inline-block h-[19px] w-4 py-[1.5px] align-text-bottom" />
                New equation
              </span>
            )}
          </div>
        </PopoverTrigger>

        <EquationPopoverContent
          variant="equationInline"
          className="my-auto"
          placeholder="E = mc^2"
          setOpen={setOpen}
        />
      </Popover>

      {children}
    </PlateElement>
  );
}
