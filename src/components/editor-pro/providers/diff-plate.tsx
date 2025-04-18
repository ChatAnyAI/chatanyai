import { memo, useMemo, useState } from 'react';

import { type Value, NodeApi } from '@udecode/plate';
import { computeDiff } from '@udecode/plate-diff';
import { createPlateEditor, Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { useObjectVersion } from '@/hooks/useObjectVersion';
import { blockSelectionReadOnlyPlugin } from '@/components/editor-pro/components/editor/plugins/block-selection-plugin';
import { viewPlugins } from '@/components/editor-pro/components/editor/plugins/editor-plugins';
import { Editor } from '@/components/editor-pro/potion-ui/editor';

import { useResetEditorOnChange } from '../utils';
import { ChunkPlugin } from '../version-history/chunks';
import { collapseBlocksWithoutDiff } from '../version-history/chunks/collapseBlocksWithoutDiff';
import { DiffPlugin, textsAreComparable } from '../version-history/diff';
import { hasDiff } from '../version-history/diff/hasDiff';

// Workaround to ignore ids in the diff
const removeIds = (nodes: any[]): any[] => {
  return nodes.map((node) => {
    const { id, ...rest } = node;

    if (rest.children) {
      rest.children = removeIds(rest.children);
    }

    return rest;
  });
};

export interface DiffViewerProps {
  current: Value;
  previous: Value | null;
  showDiff?: boolean;
}

export const DiffPlate = memo(
  ({ current = [], previous = [], showDiff }: DiffViewerProps) => {
    const diffPlugins = useMemo(() => [...viewPlugins, DiffPlugin], []);

    const diffValue = useMemo(() => {
      if (!previous) return current;

      const tempEditor = createPlateEditor({
        plugins: diffPlugins,
      });

      const diff = computeDiff(removeIds(previous), removeIds(current), {
        ignoreProps: ['id'],
        isInline: tempEditor.api.isInline,
        lineBreakChar: '¶',
        elementsAreRelated: (element, nextElement) =>
          textsAreComparable(
            NodeApi.string(element),
            NodeApi.string(nextElement)
          ),
      });

      return diff as Value;
    }, [previous, current, diffPlugins]);

    const [expandedChunks, setExpandedChunks] = useState<number[]>([]);

    const collapsedDiffValue = useMemo(
      () =>
        collapseBlocksWithoutDiff(diffValue, {
          expandedChunks,
        }) as Value,
      [diffValue, expandedChunks]
    );

    const value = showDiff ? collapsedDiffValue : current;
    const key = useObjectVersion(value);

    const hasChangedBlocks = useMemo(
      () => diffValue.some(hasDiff),
      [diffValue]
    );

    const emptyDiff = showDiff && !hasChangedBlocks;

    const editor = useCreateEditor(
      {
        plugins: [
          ...diffPlugins,
          ChunkPlugin.configure({ options: { setExpandedChunks } }),
          blockSelectionReadOnlyPlugin,
        ],
        readOnly: true,
        value,
      },
      [key]
    );

    useResetEditorOnChange(
      {
        editor: editor,
        value: collapsedDiffValue as any,
      },
      [key]
    );

    if (emptyDiff) {
      return (
        <div className="rounded-lg py-3 text-left text-muted-foreground select-none">
          No changes since the previous snapshot
        </div>
      );
    }

    return (
      <Plate readOnly editor={editor}>
        <Editor variant="update" className="pt-2 pb-3" autoFocus />
      </Plate>
    );
  }
);
