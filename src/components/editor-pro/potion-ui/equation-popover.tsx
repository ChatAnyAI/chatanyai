'use client';

import React, { useEffect } from 'react';

import type { TEquationElement } from '@udecode/plate-math';

import { cn } from '@udecode/cn';
import { useEquationInput } from '@udecode/plate-math/react';
import { BlockSelectionPlugin } from '@udecode/plate-selection/react';
import {
  createPrimitiveComponent,
  useEditorRef,
  useElement,
  useReadOnly,
  useSelected,
} from '@udecode/plate/react';
import { CornerDownLeftIcon } from 'lucide-react';

import { Button } from './button';
import { PopoverContent } from './popover';
import { type TextareaAutosizeProps, TextareaAutosize } from './textarea';

// TODO: syntax highlight
const EquationInput = createPrimitiveComponent(TextareaAutosize)({
  propsHook: useEquationInput,
});

const EquationPopoverContent = ({
  className,
  setOpen,
  ...props
}: {
  setOpen: (open: boolean) => void;
} & TextareaAutosizeProps) => {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const element = useElement<TEquationElement>();
  const selected = useSelected();
  const isInline = props.variant === 'equationInline';

  useEffect(() => {
    if (isInline && selected) {
      setOpen(true);
    }
  }, [selected, isInline, setOpen]);

  if (readOnly) return null;

  const onClose = () => {
    setOpen(false);

    if (isInline) {
      editor.tf.select(element, { next: true });
    } else {
      editor
        .getApi(BlockSelectionPlugin)
        .blockSelection.addSelectedRow(element.id as string);
    }
  };

  return (
    <PopoverContent
      variant="equation"
      className="flex gap-2"
      onEscapeKeyDown={(e) => {
        e.preventDefault();
      }}
      contentEditable={false}
    >
      <EquationInput
        className={cn('grow', className)}
        state={{ isInline, open: true, onClose }}
        autoFocus
        {...props}
      />

      <Button variant="brand" className="px-3" onClick={onClose}>
        Done <CornerDownLeftIcon className="size-3.5" />
      </Button>
    </PopoverContent>
  );
};

export { EquationPopoverContent };
