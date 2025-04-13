import { CaptionPlugin } from '@udecode/plate-caption/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';

import { ImagePreview } from '@/components/editor-pro/potion-ui/image-preview';
import { MediaUploadToast } from '@/components/editor-pro/potion-ui/media-upload-toast';

export const mediaPlugins = [
  PlaceholderPlugin.configure({
    render: { afterEditable: MediaUploadToast },
  }),
  ImagePlugin.extend({
    options: { disableUploadInsert: true },
    render: {
      afterEditable: ImagePreview,
    },
  }),
  MediaEmbedPlugin,
  VideoPlugin,
  AudioPlugin,
  FilePlugin,
  CaptionPlugin.configure({
    options: {
      plugins: [ImagePlugin, VideoPlugin, AudioPlugin, MediaEmbedPlugin],
    },
  }),
] as const;
