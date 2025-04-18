import type { DiffOperation } from '@udecode/plate-diff';

import { type PlateLeafProps, PlateLeaf } from '@udecode/plate/react';

import { describeUpdate } from './describeUpdate';

const diffOperationColors: Record<DiffOperation['type'], string> = {
  delete: 'bg-red-200',
  insert: 'bg-green-200',
  update: 'bg-blue-200',
};

export function DiffLeaf({ children, ...props }: PlateLeafProps) {
  const diffOperation = props.leaf.diffOperation as DiffOperation;

  const Component = {
    delete: 'del',
    insert: 'ins',
    update: 'span',
  }[diffOperation.type] as any;

  return (
    <PlateLeaf {...props} asChild>
      <Component
        className={diffOperationColors[diffOperation.type]}
        title={
          diffOperation.type === 'update'
            ? describeUpdate(diffOperation)
            : undefined
        }
      >
        {children}
      </Component>
    </PlateLeaf>
  );
}
