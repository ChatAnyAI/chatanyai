'use client';

import React from 'react';

import { Plate } from '@udecode/plate/react';

import { editorPlugins } from '@/components/editor-pro/components/editor/plugins/editor-plugins';
import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { DEMO_VALUES } from '@/components/editor-pro/example/demo-values';
import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';

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
