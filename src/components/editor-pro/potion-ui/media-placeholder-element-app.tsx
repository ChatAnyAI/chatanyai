'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import { cn } from '@udecode/cn';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  PlaceholderProvider,
  usePlaceholderElementState,
  VideoPlugin,
} from '@udecode/plate-media/react';
import { PlateElement, withHOC } from '@udecode/plate/react';
import { AudioLinesIcon, FileUpIcon, FilmIcon, ImageIcon } from 'lucide-react';

import { BlockActionButton } from '@/components/editor-pro/potion-ui/block-context-menu';
import { Spinner } from '@/components/editor-pro/potion-ui/spinner';

import { MediaPlaceholderPopover } from './media-placeholder-popover-app';

const CONTENT: Record<
  string,
  {
    content: ReactNode;
    icon: ReactNode;
  }
> = {
  [AudioPlugin.key]: {
    content: 'Add an audio file',
    icon: <AudioLinesIcon />,
  },
  [FilePlugin.key]: {
    content: 'Add a file',
    icon: <FileUpIcon />,
  },
  [ImagePlugin.key]: {
    content: 'Add an image',
    icon: <ImageIcon />,
  },
  [VideoPlugin.key]: {
    content: 'Add a video',
    icon: <FilmIcon />,
  },
};

export const MediaPlaceholderElement = withHOC(
  PlaceholderProvider,
  function MediaPlaceholderElement({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof PlateElement>) {
    const { mediaType, progresses, progressing, setSize, updatedFiles } =
      usePlaceholderElementState();

    const currentContent = CONTENT[mediaType];

    const isImage = mediaType === ImagePlugin.key;

    const file: File | undefined = updatedFiles?.[0];
    const progress = file ? progresses?.[file.name] : undefined;

    const imageRef = useRef<HTMLImageElement>(null);
    useEffect(() => {
      if (!imageRef.current) return;

      const { height, width } = imageRef.current;

      setSize?.({
        height,
        width,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imageRef.current]);

    return (
      <PlateElement className={cn('relative my-1', className)} {...props}>
        <MediaPlaceholderPopover>
          {(!progressing || !isImage) && (
            <div
              className={cn(
                'flex cursor-pointer items-center rounded-sm bg-muted p-3 pr-9 transition-bg-ease select-none hover:bg-primary/10'
              )}
              contentEditable={false}
              role="button"
            >
              <div className="relative mr-3 flex text-muted-foreground/80 [&_svg]:size-6">
                {currentContent.icon}
              </div>
              <div className="text-sm whitespace-nowrap text-muted-foreground">
                <div>{progressing ? file?.name : currentContent.content}</div>

                {progressing && !isImage && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div>{formatBytes(file.size)}</div>
                    <div>–</div>
                    <div className="flex items-center">
                      <Spinner className="mr-1 size-3.5" />
                      {progress ?? 0}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </MediaPlaceholderPopover>

        {isImage && progressing && file && (
          <ImageProgress file={file} imageRef={imageRef} progress={progress} />
        )}

        <BlockActionButton />

        {children}
      </PlateElement>
    );
  }
);

export function ImageProgress({
  className,
  file,
  imageRef,
  progress = 0,
}: {
  file: File;
  className?: string;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  progress?: number;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!objectUrl) {
    return null;
  }

  return (
    <div className={cn('relative', className)} contentEditable={false}>
      <img
        ref={imageRef}
        className="h-auto w-full rounded-xs object-cover"
        alt={file.name}
        src={objectUrl}
      />
      {progress < 100 && (
        <div className="absolute right-1 bottom-1 flex items-center space-x-2 rounded-full bg-black/50 px-1 py-0.5">
          <Spinner />
          <span className="text-xs font-medium text-white">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: 'accurate' | 'normal';
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts;

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];

  if (bytes === 0) return '0 Byte';

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate'
      ? (accurateSizes[i] ?? 'Bytest')
      : (sizes[i] ?? 'Bytes')
  }`;
}
