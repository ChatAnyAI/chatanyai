'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import { playgroundValue } from '@/components/editor-pro/example/playground-value';
import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';
import { TocSidebar } from '@/components/editor-pro/potion-ui/toc-sidebar';

import { copilotPlugins } from './plugins/copilot-plugins';
import { editorPlugins } from './plugins/editor-plugins';
import { useCreateEditor } from './use-create-editor';

export function PlateEditor() {
  const editor = useCreateEditor({
    plugins: [...copilotPlugins, ...editorPlugins],
    value: playgroundValue,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <TocSidebar className="top-[130px]" topOffset={30} />

        <EditorContainer>
          <Editor variant="demo" placeholder="Type..." />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
