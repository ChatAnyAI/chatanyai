'use client';

import React, { useMemo, useState } from 'react';

import type { RouterCommentItem } from '@/server/api/types';
import type { Value } from '@udecode/plate';

import { cn } from '@udecode/cn';
import { Plate, useEditorPlugin } from '@udecode/plate/react';
import { produce } from 'immer';

import { useCurrentUser } from '@/hooks/use-current-user';
import { ExtendedCommentsPlugin } from '@/components/editor-pro/components/editor/plugins/comments/ExtendedCommentsPlugin';
import { Icons } from '@/components/ui/icons';
import { formatCommentDate } from '@/lib/date/formatDate';
import { useDocumentId } from '@/hooks/use-document-id';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/editor-pro/potion-ui/avatar';
import { Button } from '@/components/editor-pro/potion-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/editor-pro/potion-ui/dropdown-menu';
import { Editor, EditorContainer } from '@/components/editor-pro/potion-ui/editor';
import { api, useTRPC } from '@/trpc/react';

import { useCommentEditor } from './comment-create-form';
import { ApiDocDiscussionResolve, ApiDocDiscussionDetele, ApiDocCommentUpdate, ApiDocCommentDetele } from '@/service/api';

export function CommentItem(props: {
  comment: RouterCommentItem;
  discussionLength: number;
  documentContent: string;
  editingId: string | null;
  index: number;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  showDocumentContent?: boolean;
  onEditorClick?: () => void;
}) {
  const {
    comment,
    discussionLength,
    documentContent,
    editingId,
    index,
    setEditingId,
    showDocumentContent = false,
    onEditorClick,
  } = props;
  const { user } = comment;

  const trpc = useTRPC();
  const documentId = useDocumentId();
  const resolveDiscussion = {
    mutate: async (input: { id: string }) => {
      try {
        // Store previous discussions for rollback in case of error
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        // Optimistically update UI
        trpc.comment.discussions.setData({ documentId }, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            const index = draft.discussions.findIndex(
              (comment) => comment.id === input.id
            );

            if (index === -1) return;

            draft.discussions[index].isResolved = true;
          })
        );

        // Make the actual API call
        await ApiDocDiscussionResolve({ id: input.id });

        // On success, invalidate the query to refetch fresh data
        void trpc.comment.discussions.invalidate({ documentId });
        
        return { previousDiscussions };
      } catch (error) {
        // Restore previous data if there's an error
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
    }
  };

  const removeDiscussion = {
    mutate: async (input: { id: string }) => {
      try {
        // Store previous discussions for rollback in case of error
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        // Optimistically update UI
        trpc.comment.discussions.setData({ documentId }, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            const index = draft.discussions.findIndex(
              (comment) => comment.id === input.id
            );

            if (index === -1) return;

            draft.discussions.splice(index, 1);
          })
        );

        // Make the actual API call
        await ApiDocDiscussionDetele({ id: input.id });

        // On success, invalidate the query to refetch fresh data
        void trpc.comment.discussions.invalidate({ documentId });
        
        return { previousDiscussions };
      } catch (error) {
        // Restore previous data if there's an error
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
    }
  };

  const updateComment = {
    mutate: async (input: { id: string; contentRich: any; discussionId: string; isEdited: boolean }) => {
      try {
        // Store previous discussions for rollback in case of error
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        // Optimistically update UI
        trpc.comment.discussions.setData({ documentId }, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            const discussionsIndex = draft.discussions.findIndex(
              (discussion) => discussion.id === input.discussionId
            );

            if (discussionsIndex === -1) return;

            const replyIndex = draft.discussions[
              discussionsIndex
            ].comments.findIndex((comment) => comment.id === input.id);

            if (replyIndex === -1) return;

            const discussions = draft.discussions[discussionsIndex];
            const comment = discussions.comments[replyIndex];

            comment.isEdited = true;
            comment.contentRich = input.contentRich as any;
            comment.updatedAt = new Date();
          })
        );

        // Make the actual API call
        await ApiDocCommentUpdate({
          id: input.id,
          contentRich: input.contentRich,
          discussionId: input.discussionId,
          isEdited: input.isEdited
        });

        // On success, invalidate the query to refetch fresh data
        void trpc.comment.discussions.invalidate({ documentId });
        
        return { previousDiscussions };
      } catch (error) {
        // Restore previous data if there's an error
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
    }
  };

  const { id: currentUserId } = useCurrentUser();
  const { tf } = useEditorPlugin(ExtendedCommentsPlugin);

  const isMyComment = useMemo(
    () => currentUserId === user.id,
    [currentUserId, user.id]
  );

  const initialValue = comment.contentRich as Value;

  const commentEditor = useCommentEditor(
    {
      id: comment.id,
      value: initialValue,
    },
    [initialValue]
  );

  const onCancel = () => {
    setEditingId(null);
    commentEditor.tf.replaceNodes(initialValue, {
      at: [],
      children: true,
    });
  };

  const onSave = () => {
    updateComment.mutate({
      id: comment.id,
      contentRich: commentEditor.children,
      discussionId: comment.discussionId,
      isEdited: true,
    });
    setEditingId(null);
  };

  const onResolveComment = () => {
    resolveDiscussion.mutate({ id: comment.discussionId });
    tf.comment.unsetMark({ id: comment.discussionId });
  };

  const isFirst = index === 0;
  const isLast = index === discussionLength - 1;
  const isEditing = editingId && editingId === comment.id;

  const [hovering, setHovering] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative flex items-center">
        {user && (
          <Avatar className="mr-2 size-6">
            <AvatarImage alt={user.name!} src={user.profileImageUrl!} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
        )}

        <h4 className="text-sm leading-none font-semibold">{user?.name}</h4>

        <div className="ml-1.5 text-xs leading-none text-muted-foreground/80">
          <span className="mr-1">{formatCommentDate(comment.createdAt)}</span>
          {comment.isEdited && <span>(edited)</span>}
        </div>

        {isMyComment && (hovering || dropdownOpen) && (
          <div className="absolute top-0 right-0 flex space-x-1">
            {index === 0 && (
              <Button
                variant="ghost"
                className="h-6 p-1 text-muted-foreground"
                onClick={onResolveComment}
                tooltip="Resolve"
                type="button"
              >
                <Icons.check className="size-4" />
              </Button>
            )}

            <CommentMoreDropdown
              onCloseAutoFocus={() => {
                setTimeout(() => {
                  commentEditor.tf.focus({ edge: 'endEditor' });
                }, 0);
              }}
              onRemoveComment={() => {
                if (discussionLength === 1) {
                  tf.comment.unsetMark({ id: comment.discussionId });
                  removeDiscussion.mutate({ id: comment.discussionId });
                }
              }}
              comment={comment}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              setEditingId={setEditingId}
            />
          </div>
        )}
      </div>

      {isFirst && showDocumentContent && (
        <div className="relative mt-1 flex pl-[32px] text-sm text-subtle-foreground">
          {discussionLength > 1 && (
            <div className="absolute top-[5px] left-3 h-full w-0.5 shrink-0 bg-muted" />
          )}
          <div className="my-px w-0.5 shrink-0 bg-highlight" />
          <div className="ml-2">{documentContent}</div>
        </div>
      )}

      <div className="relative my-1 pl-[26px]">
        {!isLast && (
          <div className="absolute top-0 left-3 h-full w-0.5 shrink-0 bg-muted" />
        )}
        <Plate readOnly={!isEditing} editor={commentEditor}>
          <EditorContainer variant="comment">
            <Editor
              variant="comment"
              className="w-auto grow"
              onClick={() => onEditorClick?.()}
            />

            {isEditing && (
              <div className="ml-auto flex shrink-0 gap-1">
                <Button
                  size="iconSm"
                  variant="ghost"
                  className="size-[28px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    void onCancel();
                  }}
                >
                  <div className="flex size-5 items-center justify-center rounded-full bg-primary/40">
                    <Icons.x className="size-3 stroke-[3px] text-background" />
                  </div>
                </Button>

                <Button
                  size="iconSm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    void onSave();
                  }}
                >
                  <div className="flex size-5 items-center justify-center rounded-full bg-brand">
                    <Icons.check className="size-3 stroke-[3px] text-background" />
                  </div>
                </Button>
              </div>
            )}
          </EditorContainer>
        </Plate>
      </div>
    </div>
  );
}

interface CommentMoreDropdownProps {
  comment: RouterCommentItem;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  onCloseAutoFocus?: () => void;
  onRemoveComment?: () => void;
}

export function CommentMoreDropdown(props: CommentMoreDropdownProps) {
  const {
    comment,
    dropdownOpen,
    setDropdownOpen,
    setEditingId,
    onCloseAutoFocus,
    onRemoveComment,
  } = props;

  const trpc = useTRPC();
  const documentId = useDocumentId();
  const deleteComment = {
    mutate: async (input: { id: string; discussionId: string }) => {
      try {
        // Store previous discussions for rollback in case of error
        await trpc.comment.discussions.cancel();
        const previousDiscussions = trpc.comment.discussions.getData({
          documentId,
        });

        // Optimistically update UI
        trpc.comment.discussions.setData({ documentId }, (old) =>
          produce(old, (draft) => {
            if (!draft) return draft;

            const discussionId = draft.discussions.findIndex(
              (discussion) => discussion.id === input.discussionId
            );

            if (discussionId === -1) return;

            const discussions = draft.discussions[discussionId];

            const replyIndex = discussions.comments.findIndex(
              (comment) => comment.id === input.id
            );

            discussions.comments.splice(replyIndex, 1);
          })
        );

        // Make the actual API call
        await ApiDocCommentDetele({ id: input.id });

        // On success, invalidate the query to refetch fresh data
        void trpc.comment.discussions.invalidate({ documentId });
        onRemoveComment?.();
        
        return { previousDiscussions };
      } catch (error) {
        // Restore previous data if there's an error
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
    }
  };

  const selectedEditCommentRef = React.useRef<boolean>(false);

  const onDeleteComment = React.useCallback(() => {
    if (!comment.id)
      return alert('You are operating too quickly, please try again later.');

    deleteComment.mutate({
      id: comment.id,
      discussionId: comment.discussionId,
    });
  }, [comment.discussionId, comment.id, deleteComment]);

  const onEditComment = React.useCallback(() => {
    selectedEditCommentRef.current = true;

    if (!comment.id)
      return alert('You are operating too quickly, please try again later.');

    setEditingId(comment.id);
  }, [comment.id, setEditingId]);

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          className={cn('h-6 p-1 text-muted-foreground')}
          tooltip="More actions"
        >
          <Icons.more className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-48"
        onCloseAutoFocus={(e) => {
          if (selectedEditCommentRef.current) {
            onCloseAutoFocus?.();
            selectedEditCommentRef.current = false;
          }

          return e.preventDefault();
        }}
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEditComment}>
            <Icons.edit className="size-4" />
            Edit comment
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteComment}>
            <Icons.trash className="size-4" />
            Delete comment
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
