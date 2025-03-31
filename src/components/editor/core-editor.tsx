'use client';

import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import {useCoreEditor} from '@/components/editor/use-create-editor';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import {Operation, withHistory, PlateEditor} from "@udecode/plate";
import { ApiDocContent} from "@/service/api";
import {toast} from "@/hooks/use-toast";

interface EditorProps {
    appId: string;
    chatId: string;
    readOnly?: boolean;
    initialValue?: any;
    onChange?: (value: any) => void;
    topHeader?: boolean;
    headerDom: React.ReactNode;
}

export function CoreEditor(props: EditorProps) {
    const { readOnly, appId, onChange, chatId, initialValue } = props;
    const editor = useCoreEditor(initialValue);
    const historyEditor = withHistory(editor);
    const [changes, setChanges] = useState<Operation[]>([]);

    // Add effect to update editor content when initialValue changes
    useEffect(() => {
        if (editor && initialValue) {

            editor.tf.setValue(initialValue);
        }
    }, [initialValue, editor]);

    const handleChange = (newValue: any) => {
        const operations = historyEditor.operations;
        setChanges((prevChanges) => [...prevChanges, ...operations]);
        console.log('operations',operations)
        console.log('changes',changes)
        console.log('newValue',newValue)
        // submitForm()
        onChange?.(newValue);


        try {
            ApiDocContent(appId,chatId,{
                content: newValue.value
            });
        } catch (error) {
            toast({
                title: 'ApiDocContent Fail',
                description: 'ApiDocContent Fail'+String(error),
                variant: 'destructive'
            });
        }
    };

  return (
      <div  data-registry="plate">
          <DndProvider backend={HTML5Backend}>
              <Plate
                  editor={editor}
                  readOnly={readOnly}
                  onValueChange={handleChange}
              >
                  <EditorContainer>
                      <Editor variant="demo" />
                  </EditorContainer>
              </Plate>
          </DndProvider>
      </div>

);
}
