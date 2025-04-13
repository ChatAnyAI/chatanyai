import { CaptionPlugin } from '@udecode/plate-caption/react';
import { ImagePlugin } from '@udecode/plate-media/react';

import { ImageElement } from '@/components/editor-pro/potion-ui/image-element';
import { ImagePreview } from '@/components/editor-pro/potion-ui/image-preview';

export const mediaToolbarPlugins = [
  ImagePlugin.extend({
    render: {
      afterEditable: ImagePreview,
      node: ImageElement,
    },
  }),
  CaptionPlugin.configure({
    options: { plugins: [ImagePlugin] },
  }),
] as const;
