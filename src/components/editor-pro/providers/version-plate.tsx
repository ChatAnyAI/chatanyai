import type { Value } from '@udecode/plate';

import { Plate } from '@udecode/plate/react';

import { useCreateEditor } from '@/components/editor-pro/components/editor/use-create-editor';
import { Editor } from '@/components/editor-pro/potion-ui/editor';

export function VersionPlate({
  children,
  ...props
}: React.PropsWithChildren<{
  id: string;
  value: Value;
}>) {
  const { id, value } = props;

  const editor = useCreateEditor({ id, readOnly: true, value });

  return (
    <Plate readOnly editor={editor}>
      <Editor variant="versionHistory" autoFocus />
    </Plate>
  );
}
