'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';
import { TocSidebar } from '@/components/editor-pro/potion-ui/toc-sidebar';

import { copilotPlugins } from './plugins/copilot-plugins';
import { editorPlugins } from './plugins/editor-plugins';
import { useCreateEditor } from './use-create-editor';

import { ApiDocContent } from "@/service/api";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import { Operation, withHistory } from '@udecode/plate';

interface EditorProps {
    appId: string;
    channelId: string;
    readOnly?: boolean;
    initialValue?: any;
    onChange?: (value: any) => void;
    topHeader?: boolean;
}
export function CoreEditor(props: EditorProps) {
    const { readOnly, appId, onChange, channelId, initialValue } = props;
    const [changes, setChanges] = useState<Operation[]>([]);
    const editor = useCreateEditor({
        plugins: [...copilotPlugins, ...editorPlugins],
        value: initialValue,
    });
    const historyEditor = withHistory(editor);
    // Add effect to update editor content when initialValue changes
    useEffect(() => {
        if (editor && initialValue) {

            editor.tf.setValue(initialValue);
        }
    }, [initialValue, editor]);

    const handleChange = (newValue: any) => {
        const operations = historyEditor.operations;
        setChanges((prevChanges) => [...prevChanges, ...operations]);
        console.log('operations', operations)
        console.log('changes', changes)
        console.log('newValue', newValue)
        // submitForm()
        onChange?.(newValue);


        try {
            ApiDocContent(appId, channelId, {
                content: newValue.value
            });
        } catch (error) {
            toast({
                title: 'ApiDocContent Fail',
                description: 'ApiDocContent Fail' + String(error),
                variant: 'destructive'
            });
        }
    };


  return (
    <DndProvider backend={HTML5Backend}>
          <Plate editor={editor} readOnly={readOnly}
              onValueChange={handleChange}>
        <TocSidebar className="top-[130px]" topOffset={30} />

        <EditorContainer>
          <Editor variant="demo" placeholder="Type..." />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}
