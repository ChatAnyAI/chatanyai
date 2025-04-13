import { CaptionPlugin } from '@udecode/plate-caption/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';

import { ImageElement } from '@/components/editor-pro/potion-ui/image-element';
import { ImagePreview } from '@/components/editor-pro/potion-ui/image-preview';

export const uploadPlugins = [
  PlaceholderPlugin,
  ImagePlugin.extend({
    render: {
      afterEditable: ImagePreview,
      node: ImageElement,
    },
  }),
  VideoPlugin,
  AudioPlugin,
  MediaEmbedPlugin,
  FilePlugin,
  CaptionPlugin.configure({
    options: { plugins: [ImagePlugin] },
  }),
] as const;
