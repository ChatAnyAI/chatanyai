import { useCallback } from 'react';

import { produce } from 'immer';

import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { useWarnIfUnsavedChanges } from '@/hooks/useWarnIfUnsavedChanges';
import { mergeDefined } from '@/lib/mergeDefined';
import { api, useTRPC } from '@/trpc/react';
import { ApiDocContent, ApiUpdateAppInfo } from '@/service/api'

export const useUpdateDocumentMutation = () => {
  const trpc = useTRPC();

  return {
    mutate: async (input: { id: string; title?: string; contentRich?: any }) => {
      // Extract app and channel IDs from the document ID
      const [appId, channelId] = input.id.split(':');
      
      // Store previous data for rollback in case of error
      const previousDocuments = trpc.document.documents.getData({});
      const previousDocument = trpc.document.document.getData({ id: input.id });
      
      try {
        // Update local data optimistically
        trpc.document.document.setData({ id: input.id }, (old) =>
          produce(old, (draft) => {
            if (!draft?.document) return draft;

            draft.document = {
              ...mergeDefined(input, draft.document, {
                omitNull: true,
              }),
            };
          })
        );

        trpc.document.documents.setData({}, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            draft.documents = draft.documents.map((document) => {
              if (document.id === input.id) {
                return mergeDefined(input, document, { omitNull: true });
              }

              return document;
            });
          })
        );

        // Only call the API if we have content to update
        if (input.contentRich) {
          await ApiDocContent(appId, channelId, { 
            content: JSON.stringify(input.contentRich) 
          });
        }
        
        return { id: input.id, previousDocument, previousDocuments };
      } catch (error) {
        // Rollback on error
        if (previousDocuments) {
          trpc.document.documents.setData({}, previousDocuments);
        }
        if (previousDocument) {
          trpc.document.document.setData(
            { id: input.id },
            previousDocument
          );
        }
        throw error;
      }
    },
    isPending: () => false, // Simplified state management
    reset: () => {}, // No-op function to match original API
  };
};

export const useUpdateDocumentTitle = () => {
  const trpc = useTRPC();
  const { mutate: updateDocument } = useUpdateDocumentMutation();

  return useCallback(
    (input: { id: string; title: string }) => {
      // Extract app and channel IDs from the document ID
      const [appId, channelId] = input.id.split(':');
      
      // Store the current document data for UI optimistic updates
      const currentDocument = trpc.document.document.getData({ id: input.id });
      const parentDocumentId = currentDocument?.document?.parentDocumentId;

      // Update local data optimistically for responsive UI
      void Promise.all([
        trpc.document.document.setData({ id: input.id }, (prevData) =>
          produce(prevData, (draft) => {
            if (draft?.document) {
              draft.document = {
                ...mergeDefined({ title: input.title }, draft.document, {
                  omitNull: true,
                }),
              };
            }
          })
        ),
        trpc.document.documents.setData({}, (prevData) =>
          produce(prevData, (draft) => {
            if (!draft) return draft;

            draft.documents = draft.documents.map((document) => {
              if (document.id === input.id) {
                return mergeDefined({ title: input.title }, document, { omitNull: true });
              }
              return document;
            });
          })
        ),
        parentDocumentId
          ? trpc.document.documents.setData({ parentDocumentId }, (prevData) =>
              produce(prevData, (draft) => {
                if (!draft) return draft;

                draft.documents = draft.documents.map((document) => {
                  if (document.id === input.id) {
                    return mergeDefined({ title: input.title }, document, { omitNull: true });
                  }
                  return document;
                });
              })
            )
          : Promise.resolve(),
      ]);
      
      // Call the API to update the document title
      void ApiUpdateAppInfo(appId, {
        name: input.title,
      });
    },
    [trpc]
  );
};

export const useArchiveDocumentMutation = () => {
  const trpc = useTRPC();

  return api.document.archive.useMutation({
    onError: (_, __, context: any) => {
      if (context?.previousDocuments) {
        trpc.document.documents.setData({}, context.previousDocuments);
      }
      if (context?.previousDocument) {
        trpc.document.document.setData(
          { id: context.id },
          context.previousDocument
        );
      }
    },
    onMutate: async (input) => {
      await trpc.document.documents.cancel();
      await trpc.document.document.cancel({ id: input.id });

      const previousDocuments = trpc.document.documents.getData({});
      const previousDocument = trpc.document.document.getData({ id: input.id });

      trpc.document.documents.setData({}, (old) =>
        produce(old, (draft) => {
          if (!draft) return draft;

          draft.documents = draft.documents.filter(
            (document) => document.id !== input.id
          );
        })
      );

      trpc.document.document.setData({ id: input.id }, (old) =>
        produce(old, (draft) => {
          if (!draft?.document) return draft;

          draft.document.isArchived = true;
        })
      );

      return { id: input.id, previousDocument, previousDocuments };
    },
    onSuccess: () => {
      void trpc.document.documents.invalidate();
    },
  });
};

export const useUpdateDocumentValue = () => {
  const trpc = useTRPC();
  const updateDocument = useUpdateDocumentMutation();
  const updateDocumentDebounced = useDebouncedCallback(
    updateDocument.mutate,
    500
  );

  useWarnIfUnsavedChanges({ enabled: updateDocumentDebounced.isPending() });

  return useCallback(
    (input: { id: string; value: any }) => {
      updateDocumentDebounced({
        id: input.id,
        contentRich: input.value,
      });

      void trpc.document.document.setData({ id: input.id }, (prevData) =>
        produce(prevData, (draft) => {
          if (draft?.document) {
            draft.document.contentRich = input.value;
          }
        })
      );
    },
    [trpc, updateDocumentDebounced]
  );
};
