'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { PlateElement, useReadOnly, withHOC } from '@udecode/plate/react';
import { FileUpIcon } from 'lucide-react';

import { BlockActionButton } from './block-context-menu';
import { Caption, CaptionTextarea } from './caption';

export const MediaFileElement = withHOC(
  ResizableProvider,
  ({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof PlateElement>) => {
    const readOnly = useReadOnly();
    const { name, unsafeUrl } = useMediaState();

    const onDownload = () => {
      window.open(unsafeUrl);
    };

    return (
      <PlateElement className={cn('my-px rounded-sm', className)} {...props}>
        <div
          className="group relative m-0 flex cursor-pointer items-center rounded px-0.5 py-[3px] transition-bg-ease hover:bg-muted"
          onClick={onDownload}
          contentEditable={false}
          role="button"
        >
          <div className="flex items-center gap-1 p-1">
            <FileUpIcon className="size-5" />

            <div>{name}</div>

            {/* TODO: add size */}
            {/* <div className="text-muted-foreground">{element.size}</div> */}
          </div>

          <Caption align="left">
            <CaptionTextarea
              className="text-left"
              readOnly={readOnly}
              placeholder="Write a caption..."
            />
          </Caption>

          <BlockActionButton className="top-1/2 -translate-y-1/2" />
        </div>

        {children}
      </PlateElement>
    );
  }
);
