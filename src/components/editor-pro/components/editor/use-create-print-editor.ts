import type { Value } from '@udecode/plate';

import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  type CreatePlateEditorOptions,
  usePlateEditor,
} from '@udecode/plate/react';
import { omit } from 'lodash';

import {
  type editorPlugins,
  viewPlugins,
} from '@/components/editor-pro/components/editor/plugins/editor-plugins';
import { mediaPlugins } from '@/components/editor-pro/components/editor/plugins/media-plugins';

import { viewComponents } from './use-create-editor';

export const printViewComponents = {
  ...viewComponents,
};

export const printComponentsWithoutMedia = omit(viewComponents, [
  ImagePlugin.key,
  MediaEmbedPlugin.key,
  VideoPlugin.key,
  FilePlugin.key,
  AudioPlugin.key,
]);

export const viewPluginsWithoutMedia = viewPlugins.filter(
  (plugin) => !(mediaPlugins.map((p) => p.key) as string[]).includes(plugin.key)
);

export const useCreatePrintEditor = (
  {
    disableMedia,
    ...options
  }: CreatePlateEditorOptions<Value, any> & {
    disableMedia?: boolean;
  } = {},
  deps: any[] = []
) => {
  const printEditor = usePlateEditor<Value, (typeof editorPlugins)[number]>(
    {
      override: {
        components: disableMedia
          ? printComponentsWithoutMedia
          : printViewComponents,
      },
      plugins: disableMedia ? viewPluginsWithoutMedia : viewPlugins,
      ...options,
    },
    deps
  );

  printEditor.mode = 'print';

  return printEditor;
};
