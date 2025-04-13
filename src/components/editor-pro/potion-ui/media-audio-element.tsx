'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { useMediaState } from '@udecode/plate-media/react';
import { ResizableProvider } from '@udecode/plate-resizable';
import { PlateElement, withHOC } from '@udecode/plate/react';

import { Caption, CaptionTextarea } from './caption';

export const MediaAudioElement = withHOC(
  ResizableProvider,
  ({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof PlateElement>) => {
    const { align = 'center', readOnly, unsafeUrl } = useMediaState();

    return (
      <PlateElement className={cn('mb-1', className)} {...props}>
        <figure className="group relative" contentEditable={false}>
          <div className="h-16">
            <audio className="size-full" src={unsafeUrl} controls />
          </div>

          <Caption style={{ width: '100%' }} align={align}>
            <CaptionTextarea
              className="h-20"
              readOnly={readOnly}
              placeholder="Write a caption..."
            />
          </Caption>
        </figure>
        {children}
      </PlateElement>
    );
  }
);
