'use client';

import React from 'react';

import type { Value } from '@udecode/plate';

import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { useInitialLocalStorage } from '@/hooks/useLocalStorage';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';

import {
  type TemplateDocument,
  useTemplateDocument,
} from '../utils/useTemplateDocument';

export function PublicPlate({ children }: React.PropsWithChildren) {
  const templateDocument = useTemplateDocument();
  const [template, setTemplate] = useInitialLocalStorage<
    TemplateDocument | undefined
  >(`potion-2-${templateDocument?.id ?? 'ai'}`, templateDocument);
  const value = template?.value;
  const id = template?.id;
  const editor = useCreateEditor({ id, value });

  const onDebouncedDocumentChange = useDebouncedCallback(
    (id: string, v: Value) => {
      setTemplate({
        id,
        icon: null,
        title: template!.title,
        value: v,
      });
    },
    1000
  );

  useWarnIfUnsavedChanges({ enabled: onDebouncedDocumentChange.isPending() });

  return (
    <Plate
      onValueChange={({ editor, value }) => {
        if (editor.resetting) {
          delete editor.resetting;

          return;
        }

        onDebouncedDocumentChange(editor.id, value);
      }}
      editor={editor}
    >
      {children}
    </Plate>
  );
}
