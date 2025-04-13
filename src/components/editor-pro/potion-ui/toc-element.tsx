import { cn } from '@udecode/cn';
import {
  useTocElement,
  useTocElementState,
} from '@udecode/plate-heading/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import { PlateElement } from '@udecode/plate/react';
import { cva } from 'class-variance-authority';

import { Button } from './button';

const headingItemVariants = cva(
  'block h-auto w-full cursor-pointer truncate rounded-none px-0.5 py-1.5 text-left font-medium text-muted-foreground underline decoration-[0.5px] underline-offset-4 hover:bg-accent hover:text-muted-foreground',
  {
    variants: {
      depth: {
        1: 'pl-0.5',
        2: 'pl-[26px]',
        3: 'pl-[50px]',
      },
    },
  }
);

export function TocElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const { editor, element } = props;
  const state = useTocElementState();

  const { props: btnProps } = useTocElement(state);

  const { headingList } = state;

  return (
    <PlateElement className={cn('my-1', className)} {...props}>
      <div contentEditable={false}>
        {headingList.length > 0 ? (
          headingList.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(headingItemVariants({ depth: item.depth as any }))}
              onClick={(e) => btnProps.onClick(e, item, 'smooth')}
              aria-current
            >
              {item.title}
            </Button>
          ))
        ) : (
          <div
            className="cursor-text px-1 py-[3px] text-sm text-muted-foreground/80 select-none"
            onClick={() => {
              editor
                .getApi(BlockSelectionPlugin)
                .blockSelection.addSelectedRow(element.id as string);
            }}
            role="button"
          >
            Add headings to display the table of contents.
          </div>
        )}
      </div>
      {children}
    </PlateElement>
  );
}
