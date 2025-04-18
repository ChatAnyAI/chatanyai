import { useEffect } from 'react';

import type { Value } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate/react';

export function useResetEditorOnChange(
  { id, editor, value }: { editor: PlateEditor; id?: string; value?: Value },
  deps: any[]
) {
  useEffect(() => {
    if (value && value !== editor.children) {
      editor.tf.replaceNodes(value, {
        at: [],
        children: true,
      });

      editor.id = id ?? editor.id;
      editor.resetting = true;
      editor.history.undos = [];
      editor.history.redos = [];
      editor.operations = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps]);
}
