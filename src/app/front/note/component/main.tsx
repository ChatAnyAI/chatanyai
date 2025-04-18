'use client';

import { useEditorScrollRef } from '@udecode/plate/react';

export function Main({ children }: { children: React.ReactNode }) {
  const ref = useEditorScrollRef();

  return (
    <main
      id="scroll_container"
      ref={ref}
      className="relative h-[calc(100vh-44px-2px)] overflow-y-auto"
    >
      {children}
    </main>
  );
}
