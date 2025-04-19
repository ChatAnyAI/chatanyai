'use client';

import React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '@/components/editor-pro/components/editor/plugins/editor-plugins';
import { tocPlugin } from '@/components/editor-pro/components/editor/plugins/toc-plugin';
import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { tocValue } from '@/components/editor-pro/example/toc-value';
import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';
import { TocSidebar } from '@/components/editor-pro/potion-ui/toc-sidebar';

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
