'use client';

import React from 'react';

import type { RightPanelType } from '@/hooks/useResizablePanel';


import { useIsDesktop } from '@/components/providers/tailwind-provider';
import { useCookieStorage } from '@/hooks/useCookieStorage';
import { useDocumentId } from '@/hooks/use-document-id';
import { useMounted } from '@/components/editor-pro/hooks/use-mounted';

import { ContextPanel } from '@/components/context-panel/context-panel';
import { Navbar } from '@/components/navbar/navbar';
import {
  type Layout,
  ResizableMidPanel,
  ResizablePanelGroup,
  ResizableRightPanel,
} from '@/components/ui/resizable-panel';

const serverPersistenceId = 'nav';
const serverPersistenceRightPanelType = 'right-panel-type';

interface PanelsProps {
  children: React.ReactNode;
  initialLayout: Layout;
  initialRightPanelType: RightPanelType;
}

export const Panels = ({
  children,
  initialLayout,
  initialRightPanelType,
}: PanelsProps) => {
  const documentId = useDocumentId();

  const isMobile = !useIsDesktop();
  const mounted = useMounted();

  const [layout, setLayoutCookieValue] = useCookieStorage<Layout>(
    serverPersistenceId,
    initialLayout
  );

  const [, setRightPanelTypeCookieValue] = useCookieStorage<RightPanelType>(
    serverPersistenceRightPanelType,
    initialRightPanelType
  );

  return (
    <ResizablePanelGroup
      className="min-h-[200px] rounded-lg"
      onLayout={setLayoutCookieValue}
      onRightPanelTypeChange={setRightPanelTypeCookieValue}
      hiddenLeft={isMobile}
      initLeftSize={layout.leftSize!}
      initRightSize={layout.rightSize!}
      serverPersistenceId={serverPersistenceId}
      serverPersistenceRightPanelType={serverPersistenceRightPanelType}
      hiddenRight
    >

      <ResizableMidPanel className="relative flex flex-col">
        <Navbar />
        {children}
      </ResizableMidPanel>

      {mounted && documentId && (
        <ResizableRightPanel maxSize={700} minSize={380}>
          <ContextPanel />
        </ResizableRightPanel>
      )}
    </ResizablePanelGroup>
  );
};
