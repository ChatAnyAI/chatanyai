import React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '@/registry/default/components/editor/plugins/editor-plugins';
import { useCreateEditor } from '@/registry/default/components/editor/use-create-editor';
import { DEMO_VALUES } from '@/registry/default/example/demo-values';
import { Editor, EditorContainer } from '@/registry/default/potion-ui/editor';

export default function Demo({ id }: { id: keyof typeof DEMO_VALUES }) {
  const editor = useCreateEditor({
    plugins: [...editorPlugins],
    value: DEMO_VALUES[id],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor variant="demo" />
      </EditorContainer>
    </Plate>
  );
}
