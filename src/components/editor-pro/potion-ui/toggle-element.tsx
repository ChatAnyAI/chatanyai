import { cn } from '@udecode/cn';
import {
  useToggleButton,
  useToggleButtonState,
} from '@udecode/plate-toggle/react';
import { PlateElement, useElement } from '@udecode/plate/react';
import { ChevronRightIcon } from 'lucide-react';

export function ToggleElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const element = useElement();
  const state = useToggleButtonState(element.id as string);
  const { buttonProps, open } = useToggleButton(state);

  return (
    <PlateElement className={cn('mb-1 pl-6', className)} {...props}>
      <div>
        <span
          className="absolute top-0.5 left-0 flex cursor-pointer items-center justify-center rounded-sm p-px transition-bg-ease select-none hover:bg-slate-200"
          contentEditable={false}
          {...buttonProps}
        >
          <ChevronRightIcon
            className={cn(
              'transition-transform duration-75',
              open ? 'rotate-90' : 'rotate-0'
            )}
          />
        </span>
        {children}
      </div>
    </PlateElement>
  );
}
