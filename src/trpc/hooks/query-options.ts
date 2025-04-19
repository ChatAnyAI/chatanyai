'use client';

import { useDocumentId } from '@/hooks/use-document-id';
import { useTRPC } from '@/trpc/react';
import { ApiGetDoc, ApiDocCommentDiscussionList, ApiDocVersionList } from '@/service/api';
import { useQuery } from '@tanstack/react-query';

export function useDocumentQueryOptions() {
  const documentId = useDocumentId();

  return {
    queryKey: ['document', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('Document ID is required');
      const document = await ApiGetDoc(documentId);
      
      // Still provide results in the same structure expected by consumers
      const trpc = useTRPC();
      trpc.document.document.setData({ id: documentId }, { document });
      
      return { document };
    },
    enabled: !!documentId,
  };
}

export function useDiscussionsQueryOptions() {
  const documentId = useDocumentId();

  return {
    queryKey: ['discussions', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('Document ID is required');
      const discussions = await ApiDocCommentDiscussionList(documentId);
      
      // Store the data in trpc cache for compatibility
      const trpc = useTRPC();
      trpc.comment.discussions.setData({ documentId }, { discussions });
      
      return { discussions };
    },
    enabled: !!documentId,
  };
}

export function useDocumentVersionsQueryOptions() {
  const documentId = useDocumentId();

  return {
    queryKey: ['documentVersions', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('Document ID is required');
      const versions = await ApiDocVersionList(documentId);
      
      // Store the data in trpc cache for compatibility
      const trpc = useTRPC();
      trpc.version.documentVersions.setData({ documentId }, { versions });
      
      return { versions };
    },
    enabled: !!documentId,
  };
}
