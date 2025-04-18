'use client';

import React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '@/registry/default/components/editor/plugins/editor-plugins';
import { useCreateEditor } from '@/registry/default/components/editor/use-create-editor';
import { DEMO_VALUES } from '@/registry/default/example/demo-values';
import { Editor, EditorContainer } from '@/registry/default/potion-ui/editor';

import { copilotPlugins } from '../components/editor/plugins/copilot-plugins';

export default function CopilotDemo() {
  const editor = useCreateEditor({
    plugins: [...copilotPlugins, ...editorPlugins],
    value: DEMO_VALUES['copilot-demo'],
  });

  return (
    <Plate editor={editor}>
      <EditorContainer variant="demo">
        <Editor variant="demo" />
      </EditorContainer>
    </Plate>
  );
}
