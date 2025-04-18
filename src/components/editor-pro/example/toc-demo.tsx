'use client';

import React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '@/registry/default/components/editor/plugins/editor-plugins';
import { tocPlugin } from '@/registry/default/components/editor/plugins/toc-plugin';
import { useCreateEditor } from '@/registry/default/components/editor/use-create-editor';
import { tocValue } from '@/registry/default/example/toc-value';
import { Editor, EditorContainer } from '@/registry/default/potion-ui/editor';
import { TocSidebar } from '@/registry/default/potion-ui/toc-sidebar';

export default function TocDemo() {
  const editor = useCreateEditor({
    plugins: [...editorPlugins, tocPlugin],
    value: tocValue,
  });

  return (
    <Plate editor={editor}>
      <TocSidebar className="*:top-12" topOffset={30} />

      <EditorContainer variant="demo" className="flex">
        <Editor variant="demo" className="h-fit" />
      </EditorContainer>
    </Plate>
  );
}
