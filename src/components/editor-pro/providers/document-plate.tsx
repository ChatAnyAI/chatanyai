'use client';

import React from 'react';

import type { Value } from '@udecode/plate';

import { useQuery } from '@tanstack/react-query';
import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { useUpdateDocumentValue } from '@/trpc/hooks/document-hooks';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

import { getTemplateDocument } from '../utils/useTemplateDocument';

export function DocumentPlate({ children }) {
  const updateDocumentValue = useUpdateDocumentValue();

  const queryOptions = useDocumentQueryOptions();
  const { data: documentId } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.id,
  });
  const { data: lockPage } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.lockPage,
  });
  const { data: isArchived } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.isArchived,
  });
  const { data: templateId } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.templateId,
  });
  const { data: contentRich } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.contentRich,
  });

  const value =
    templateId && !contentRich
      ? getTemplateDocument(templateId)?.value
      : (contentRich as Value);
  const editor = useCreateEditor({ id: documentId, value }, []);

  return (
    <Plate
      readOnly={lockPage || isArchived}
      onValueChange={({ editor, value }) => {
        updateDocumentValue({ id: editor.id, value });
      }}
      editor={editor}
    >
      {children}
    </Plate>
  );
}
