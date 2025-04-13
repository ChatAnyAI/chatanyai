'use client';

import { useEffect } from 'react';

import type { Path } from '@udecode/plate';

import { isSlateString } from '@udecode/plate';
import { getDraftCommentKey } from '@udecode/plate-comments';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { useEditorContainerRef, useHotkeys } from '@udecode/plate/react';

export const ExtendedCommentsPlugin = CommentsPlugin.extend({
  options: {
    activeId: null as string | null,
    commentingBlock: null as Path | null,
    hotkey: ['meta+shift+m', 'ctrl+shift+m'],
    hoverId: null as string | null,
    isOverlapWithEditor: false as boolean,
    uniquePathMap: new Map(),
    updateTimestamp: null as number | null,
  },
})
  .extend({
    handlers: {
      onClick: ({ api, event, setOption, type }) => {
        let leaf = event.target as HTMLElement;
        let isSet = false;

        const unsetActiveSuggestion = () => {
          setOption('activeId', null);
          isSet = true;
        };

        if (!isSlateString(leaf)) unsetActiveSuggestion();

        while (leaf.parentElement) {
          if (leaf.classList.contains(`slate-${type}`)) {
            const commentsEntry = api.comment.node();

            if (!commentsEntry) {
              unsetActiveSuggestion();

              break;
            }

            const id = api.comment.nodeId(commentsEntry[0]) ?? null;
            const isDraft = commentsEntry[0][getDraftCommentKey()];

            setOption('activeId', isDraft ? getDraftCommentKey() : id);
            isSet = true;

            break;
          }

          leaf = leaf.parentElement;
        }

        if (!isSet) unsetActiveSuggestion();
      },
    },
    useHooks: ({ editor, getOptions }) => {
      const { hotkey } = getOptions();

      const editorContainerRef = useEditorContainerRef();

      useEffect(() => {
        if (!editorContainerRef.current) return;

        const editable = editor.api.toDOMNode(editor);

        if (!editable) return;

        const observer = new ResizeObserver((entries) => {
          const width = entries[0].contentRect.width;
          const isOverlap = width < 700;

          editor.setOption(
            ExtendedCommentsPlugin,
            'isOverlapWithEditor',
            isOverlap
          );
        });

        observer.observe(editable);

        return () => {
          observer.disconnect();
        };
      }, [editor, editorContainerRef]);

      useHotkeys(
        hotkey!,
        (e) => {
          if (!editor.selection) return;

          e.preventDefault();

          if (!editor.api.isExpanded()) return;
        },
        {
          enableOnContentEditable: true,
        }
      );
    },
  })
  .overrideEditor(
    ({ editor, setOption, tf: { apply, insertBreak }, tf, type }) => ({
      transforms: {
        apply(operation) {
          if (
            operation.type !== 'set_selection' &&
            operation.type !== 'set_node' &&
            operation.type !== 'split_node' &&
            operation.type !== 'merge_node'
          ) {
            const { newProperties, properties } = operation;

            if (
              properties?.[getDraftCommentKey()] ||
              newProperties?.[getDraftCommentKey()]
            )
              return;

            setOption('updateTimestamp', Date.now());
          }

          apply(operation);
        },

        insertBreak() {
          setOption('updateTimestamp', Date.now());

          // TODO: move to SkipMarkPlugin
          tf.comment.removeMark();
          insertBreak();
          editor.tf.unsetNodes([type], {
            at: editor.selection?.focus,
            mode: 'lowest',
          });
        },
      },
    })
  );
