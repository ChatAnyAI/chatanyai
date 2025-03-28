'use client';

import React, {useState} from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { Plate } from '@udecode/plate/react';

import {useCoreEditor} from '@/components/editor/use-create-editor';
import { SettingsDialog } from '@/components/editor/settings';
import { Editor, EditorContainer } from '@/components/plate-ui/editor';
import {Operation, withHistory} from "@udecode/plate";

interface EditorProps {
    readOnly?: boolean;
    uid: number;
    initialValue?: any;
    onChange?: (value: any) => void;
    spaceGuid?: string;
    topHeader?: boolean;
    headerDom: React.ReactNode;
}

export function CoreEditor(props: EditorProps) {
  const editor = useCoreEditor([]);
    const { readOnly, uid, onChange, spaceGuid, initialValue, headerDom } = props;
    const historyEditor = withHistory(editor);
    const [changes, setChanges] = useState<Operation[]>([]);

    const handleChange = (newValue: any) => {
        const operations = historyEditor.operations;
        setChanges((prevChanges) => [...prevChanges, ...operations]);
        console.log('operations',operations)
        console.log('changes',changes)
        console.log('newValue',newValue)
        onChange?.(newValue);
    };

  return (
      <DndProvider backend={HTML5Backend}>
          <Plate
              editor={historyEditor}
              readOnly={readOnly}
              onValueChange={handleChange}
          >
              <EditorContainer>
                  <Editor variant="demo" />
              </EditorContainer>
              <SettingsDialog/>
          </Plate>
      </DndProvider>
);
}
