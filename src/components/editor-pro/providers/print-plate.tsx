'use client';

import type { Value } from '@udecode/plate';

import { useQuery } from '@tanstack/react-query';
import { Plate } from '@udecode/plate/react';
import { useSearchParams } from 'react-router-dom';

import { useCreatePrintEditor } from '@/components/editor-pro/components/editor/use-create-print-editor';
import { getTemplateDocument } from '@/components/editor-pro/utils/useTemplateDocument';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

export function PrintPlate({ children }: React.PropsWithChildren) {
  const [searchParams] = useSearchParams();
  const disableMedia = searchParams.get('disableMedia') === 'true';

  const queryOptions = useDocumentQueryOptions();

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
      ? getTemplateDocument(templateId).value
      : (contentRich as Value);

  const editor = useCreatePrintEditor(
    {
      disableMedia: disableMedia,
      value,
    },
    [value]
  );

  return (
    <Plate readOnly editor={editor}>
      {children}
    </Plate>
  );
}
