'use client';

import React from 'react';

import { getDraftCommentKey } from '@udecode/plate-comments';
import { useEditorPlugin } from '@udecode/plate/react';
import { MessageSquareTextIcon } from 'lucide-react';

import { ExtendedCommentsPlugin } from '@/components/editor-pro/components/editor/plugins/comments/ExtendedCommentsPlugin';

import { ToolbarButton } from './toolbar';

export function CommentToolbarButton() {
  const { editor, setOption, tf } = useEditorPlugin(ExtendedCommentsPlugin);

  const onCommentToolbarButton = React.useCallback(() => {
    if (!editor.selection) return;

    tf.comment.setDraft();
    editor.tf.collapse();
    setOption('activeId', getDraftCommentKey());
    setOption('commentingBlock', editor.selection.focus.path.slice(0, 1));
  }, [editor.selection, editor.tf, setOption, tf.comment]);

  return (
    <ToolbarButton
      onClick={onCommentToolbarButton}
      data-plate-prevent-overlay
      shortcut="⌘+Shift+M"
      tooltip="Comment"
    >
      <MessageSquareTextIcon className="mr-1" />
      <span className="hidden sm:inline">Comment</span>
    </ToolbarButton>
  );
}
