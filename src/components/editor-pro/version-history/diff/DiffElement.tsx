import type { DiffOperation } from '@udecode/plate-diff';
import type { NodeWrapperComponentProps } from '@udecode/plate/react';

import { describeUpdate } from './describeUpdate';

const diffOperationColors: Record<DiffOperation['type'], string> = {
  delete: 'bg-red-200',
  insert: 'bg-green-200',
  update: 'bg-blue-200',
};

export const DiffElement = ({
  children,
  editor,
  element,
}: NodeWrapperComponentProps) => {
  if (!element.diff) return children;

  const diffOperation = element.diffOperation as DiffOperation;

  const label = {
    delete: 'deletion',
    insert: 'insertion',
    update: 'update',
  }[diffOperation.type];

  const Component = editor.api.isInline(element) ? 'span' : 'div';

  return (
    <Component
      className={diffOperationColors[diffOperation.type]}
      title={
        diffOperation.type === 'update'
          ? describeUpdate(diffOperation)
          : undefined
      }
      aria-label={label}
    >
      {children}
    </Component>
  );
};
