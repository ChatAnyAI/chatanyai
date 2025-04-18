import type { SlateEditor } from '@udecode/plate';

export function getEditorWordCount(editor: SlateEditor) {
  const text = editor.api.string([]);

  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}
