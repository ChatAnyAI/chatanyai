'use client';

import { useDocumentId } from '@/hooks/use-document-id';
import { useTRPC } from '@/trpc/react';

export function useDocumentQueryOptions() {
  const documentId = useDocumentId();

  return {
    ...useTRPC().document.document.queryOptions({
      id: documentId,
    }),
    enabled:  !!documentId,
  };
}

export function useDiscussionsQueryOptions() {
  const documentId = useDocumentId();

  return useTRPC().comment.discussions.queryOptions({
    documentId,
  });
}

export function useDocumentVersionsQueryOptions() {
  const documentId = useDocumentId();

  return useTRPC().version.documentVersions.queryOptions({
    documentId,
  });
}
