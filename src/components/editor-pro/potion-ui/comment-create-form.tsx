'use client';

import React, { useEffect, useMemo } from 'react';

import { cn, withProps } from '@udecode/cn';
import { type Value, NodeApi } from '@udecode/plate';
import { AIPlugin } from '@udecode/plate-ai/react';
import {
  BasicMarksPlugin,
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { getCommentKey, getDraftCommentKey } from '@udecode/plate-comments';
import { CommentsPlugin, useCommentId } from '@udecode/plate-comments/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import { InlineEquationPlugin } from '@udecode/plate-math/react';
import {
  MentionInputPlugin,
  MentionPlugin,
} from '@udecode/plate-mention/react';
import { Plate, useEditorRef } from '@udecode/plate/react';
import { type CreatePlateEditorOptions, PlateLeaf } from '@udecode/plate/react';
import { produce } from 'immer';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { Icons } from '@/components/ui/icons';
import { mergeDefined } from '@/lib/mergeDefined';
import { useDocumentId } from '@/hooks/use-document-id';
import { omitNil } from '@/lib/omitNull';
import { AILeaf } from '@/components/editor-pro/potion-ui/ai-leaf';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/editor-pro/potion-ui/avatar';
import { Button } from '@/components/editor-pro/potion-ui/button';
import { DateElement } from '@/components/editor-pro/potion-ui/date-element';
import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';
import { EmojiInputElement } from '@/components/editor-pro/potion-ui/emoji-input-element';
import { InlineEquationElement } from '@/components/editor-pro/potion-ui/inline-equation-element';
import { LinkElement } from '@/components/editor-pro/potion-ui/link-element';
import { MentionElement } from '@/components/editor-pro/potion-ui/mention-element';
import { MentionInputElement } from '@/components/editor-pro/potion-ui/mention-input-element';
import { api, useTRPC } from '@/trpc/react';
import { ApiDocCommentWithDiscussionCreate, ApiDocCommentCreate } from '@/service/api';

export const useCommentEditor = (
  options: Omit<CreatePlateEditorOptions, 'plugins'> = {},
  deps: any[] = []
) => {
  const commentEditor = useCreateEditor(
    {
      id: 'comment',
      override: {
        components: {
          [AIPlugin.key]: AILeaf,
          [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
          [DatePlugin.key]: DateElement,
          [EmojiInputPlugin.key]: EmojiInputElement,
          [InlineEquationPlugin.key]: InlineEquationElement,
          [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
          [LinkPlugin.key]: LinkElement,
          [MentionInputPlugin.key]: MentionInputElement,
          [MentionPlugin.key]: MentionElement,
          [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
          [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
          // [SlashInputPlugin.key]: SlashInputElement,
        },
      },
      plugins: [BasicMarksPlugin],
      ...options,
    },
    deps
  );

  return commentEditor;
};

export function CommentCreateForm({
  autoFocus = false,
  className,
  discussionId: discussionIdProp,
  focusOnMount = false,
  isSuggesting,
}: {
  autoFocus?: boolean;
  className?: string;
  discussionId?: string;
  focusOnMount?: boolean;
  isSuggesting?: boolean;
}) {
  const trpc = useTRPC();
  const current = useCurrentUser();
  const documentId = useDocumentId();

  const createComment = {
    mutateAsync: async (input: {
      contentRich: any;
      discussionId: string;
    }) => {
      try {
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        trpc.comment.discussions.setData({ documentId }, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            const comments = draft.discussions.find(
              (comment) => comment.id === input.discussionId
            )?.comments;

            const newUserInfo = mergeDefined(omitNil(input), {
              createdAt: new Date(),
              updatedAt: new Date(),
              user: omitNil(current),
            });

            comments?.push(newUserInfo);
          })
        );

        const response = await ApiDocCommentCreate({
          contentRich: JSON.stringify(input.contentRich),
          discussionId: input.discussionId,
        });

        void trpc.comment.discussions.invalidate({ documentId });

        return response;
      } catch (error) {
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });
        if (previousDiscussions) {
          trpc.comment.discussions.setData(
            { documentId },
            previousDiscussions
          );
        }
        throw error;
      }
    },
    mutate: (input: {
      contentRich: any;
      discussionId: string;
    }) => {
      void createComment.mutateAsync(input);
    },
  };

  const createDiscussionWithComment = {
    mutateAsync: async (input: {
      contentRich: any;
      discussionId?: string;
      documentContent: string;
      documentId: string;
    }) => {
      try {
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        const response = await ApiDocCommentWithDiscussionCreate({
          contentRich: JSON.stringify(input.contentRich),
          discussionId: input.discussionId!,
          documentContent: input.documentContent,
          documentId: input.documentId,
        });

        void trpc.comment.discussions.invalidate({ documentId });

        return response;
      } catch (error) {
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });
        if (previousDiscussions) {
          trpc.comment.discussions.setData(
            { documentId },
            previousDiscussions
          );
        }
        throw error;
      }
    },
    mutate: (input: {
      contentRich: any;
      discussionId?: string;
      documentContent: string;
      documentId: string;
    }) => {
      void createDiscussionWithComment.mutateAsync(input);
    },
  };

  const editor = useEditorRef();
  const currentUser = useCurrentUser();
  const discussionId = useCommentId() ?? discussionIdProp;
  const [resetKey, setResetKey] = React.useState(0);

  const [commentValue, setCommentValue] = React.useState<Value | undefined>();
  const commentContent = useMemo(
    () =>
      commentValue
        ? NodeApi.string({ children: commentValue as any, type: 'p' })
        : '',
    [commentValue]
  );
  const commentEditor = useCommentEditor({}, [resetKey]);

  useEffect(() => {
    if (commentEditor && focusOnMount) {
      commentEditor.tf.focus();
    }
  }, [commentEditor, focusOnMount]);

  const onAddComment = React.useCallback(async () => {
    setResetKey((prev) => prev + 1);

    if (discussionId) {
      createComment.mutate({
        contentRich: commentValue as any,
        discussionId: discussionId,
      });

      return;
    }

    const commentsNodeEntry = editor
      .getApi(CommentsPlugin)
      .comment.nodes({ at: [], isDraft: true });

    if (commentsNodeEntry.length === 0) return;

    const documentContent = commentsNodeEntry
      .map(([node]) => node.text)
      .join('');

    const { id } = await createDiscussionWithComment.mutateAsync({
      contentRich: commentValue as any,
      documentContent: documentContent,
      documentId,
    });

    commentsNodeEntry.forEach(([_, path]) => {
      editor.tf.setNodes(
        {
          [getCommentKey(id)]: true,
        },
        { at: path, split: true }
      );
      editor.tf.unsetNodes([getDraftCommentKey()], { at: path });
    });
  }, [
    discussionId,
    editor,
    createDiscussionWithComment,
    commentValue,
    documentId,
    createComment,
  ]);

  const onAddSuggestion = React.useCallback(async () => {
    if (!discussionId) return;

    const suggestionId = discussionId;

    await createDiscussionWithComment.mutateAsync({
      contentRich: commentValue as any,
      discussionId: suggestionId,
      documentContent: '__suggestion__',
      documentId,
    });
  }, [discussionId, createDiscussionWithComment, commentValue, documentId]);

  return (
    <div className={cn('flex w-full', className)}>
      <div className="mt-1 shrink-0">
        {currentUser && (
          <Avatar className="mr-2 size-6">
            <AvatarImage
              alt={currentUser.name!}
              src={currentUser.profileImageUrl!}
            />
            <AvatarFallback>{currentUser.name?.[0]}</AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="relative -ml-1 flex grow gap-2">
        <Plate
          onChange={({ value }) => {
            setCommentValue(value);
          }}
          editor={commentEditor}
        >
          <EditorContainer variant="comment">
            <Editor
              variant="comment"
              className="min-h-[25px] grow pt-0.5 pr-8"
              placeholder="Reply..."
              autoComplete="off"
              autoFocus={autoFocus}
            />

            <Button
              size="iconSm"
              variant="ghost"
              className="absolute right-0 bottom-0 ml-auto shrink-0"
              disabled={commentContent.trim().length === 0}
              onClick={(e) => {
                e.stopPropagation();

                if (isSuggesting) {
                  void onAddSuggestion();
                } else {
                  void onAddComment();
                }
              }}
            >
              <div className="flex size-6 items-center justify-center rounded-full bg-brand">
                <Icons.arrowUp className="size-4 stroke-[3px] text-background" />
              </div>
            </Button>
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}
