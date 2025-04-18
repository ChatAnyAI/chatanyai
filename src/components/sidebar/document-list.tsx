'use client';

import { cn } from '@udecode/cn';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../ui/icons';
import { NavItem } from './nav-item';
import { ApiDocList, DocInfo, ApiDocChangeSort } from '@/service/api';
import useSWR from 'swr';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppType, RouteEnum } from '@/lib/constants/constants';
import { useState, useRef, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

const STORAGE_KEY = 'sidebar-expanded-state';

// Drag types constants
const DRAG_TYPES = {
  ABOVE: 'before',
  BELOW: 'after',
  INTO: 'into'
};

export const removeExpandedIdFromStorage = (documentId: string) => {
  const expandedIds = JSON.parse(
    window.localStorage.getItem(STORAGE_KEY) ?? '[]'
  ) as string[];

  if (expandedIds) {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(expandedIds.filter((id) => id !== documentId))
    );
  }
};

export const DocumentList = ({
  level = 0,
  appId,
}: {
  level?: number;
  appId: string;
}) => {
  const navigate = useNavigate();
  const { data: documents, isLoading, mutate } = useSWR(appId ? ['ApiDocList', appId] : null, () => ApiDocList(appId))

  const [expandedIds, setExpandedIds] = useLocalStorage<string[]>(
    STORAGE_KEY,
    []
  );
  
  // Drag and drop state
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const [dragPosition, setDragPosition] = useState<string | null>(null);
  const dragCounter = useRef<Record<string, number>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onExpand = (documentId: string) => {
    setExpandedIds(
      expandedIds.includes(documentId)
        ? expandedIds.filter((id) => id !== documentId)
        : [...expandedIds, documentId]
    );
  };

  const onRedirect = (documentId: string) => {
    navigate(`/${RouteEnum[AppType.Note]}/${appId}/c/${documentId}`);
  };

  // Clear drag indicators after drag ends
  const clearDragStates = useCallback(() => {
    setDraggedItemId(null);
    setDragOverItemId(null);
    setDragPosition(null);
    dragCounter.current = {};
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, documentId: string) => {
    e.stopPropagation();
    setDraggedItemId(documentId);
    // Set dragged item data for transfer
    e.dataTransfer.setData('text/plain', documentId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  // Handle drag over to determine drag position (above, below, or into)
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>, documentId: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (draggedItemId === documentId) return;
    
    // Initialize counter for this item if needed
    if (!dragCounter.current[documentId]) {
      dragCounter.current[documentId] = 0;
    }
    
    // Get the bounding rectangle of the target element
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    // Determine position based on mouse position
    let position;
    if (y < height * 0.25) {
      position = DRAG_TYPES.ABOVE;
    } else if (y > height * 0.75) {
      position = DRAG_TYPES.BELOW;
    } else {
      position = DRAG_TYPES.INTO;
    }
    
    setDragOverItemId(documentId);
    setDragPosition(position);
    
    // Reset enter/leave counter to avoid flicker
    dragCounter.current[documentId]++;
    e.dataTransfer.dropEffect = 'move';
  }, [draggedItemId]);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>, documentId: string) => {
    e.stopPropagation();
    
    // Decrement counter for this item
    if (dragCounter.current[documentId]) {
      dragCounter.current[documentId]--;
    }
    
    // Only clear if we've left completely
    if (dragCounter.current[documentId] === 0) {
      if (dragOverItemId === documentId) {
        setDragOverItemId(null);
        setDragPosition(null);
      }
    }
  }, [dragOverItemId]);

  // Handle drop to rearrange documents
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>, targetDocumentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    if (!draggedId || draggedId === targetDocumentId) {
      clearDragStates();
      return;
    }
    
    try {
      // Determine drop parameters based on position
      let parentGuid = undefined;
      let dropPosition = dragPosition === DRAG_TYPES.INTO ? DRAG_TYPES.BELOW : dragPosition;
      
      // If dropping INTO, the parent becomes the target
      if (dragPosition === DRAG_TYPES.INTO) {
        parentGuid = targetDocumentId;
        
        // Auto-expand the target if dropping into it
        if (!expandedIds.includes(targetDocumentId)) {
          setExpandedIds([...expandedIds, targetDocumentId]);
        }
      }
      
      // Call the API to change document sort order
      await ApiDocChangeSort(appId, {
        dropPosition: dropPosition as 'before' | 'after',
        guid: draggedId,
        targetGuid: dragPosition === DRAG_TYPES.INTO ? undefined : targetDocumentId,
        parentGuid: parentGuid
      });
      
      // Refresh the document list
      await mutate();
      
      toast({
        description: "Document order updated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to update document order:", error);
      toast({
        title: "Error",
        description: "Failed to update document order",
        variant: "destructive",
      });
    } finally {
      clearDragStates();
    }
  }, [appId, dragPosition, expandedIds, mutate, clearDragStates]);

  // Handle drag end to clear states
  const handleDragEnd = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    clearDragStates();
  }, [clearDragStates]);

  if (isLoading) {
    return (
      <>
        <NavItem loading level={level} />
        {level === 0 && (
          <>
            <NavItem loading level={level} />
            <NavItem loading level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        className={cn(
          'hidden cursor-pointer py-1 text-sm font-medium text-muted-foreground/80 select-none',
          expandedIds.length > 0 && 'last:block',
          level === 0 && 'hidden'
        )}
        style={{
          paddingLeft: `${16 + level * 16}px`,
        }}
      >
        {level === 0 ? 'No pages' : 'No pages inside'}
      </p>
      {documents?.map((document: DocInfo) => (
        <div 
          key={document.channelId} 
          className={cn(
            "space-y-0.5 transition-all duration-200", 
            draggedItemId === document.channelId && "opacity-50",
            dragOverItemId === document.channelId && dragPosition === DRAG_TYPES.ABOVE && "border-t-2 border-primary pt-1",
            dragOverItemId === document.channelId && dragPosition === DRAG_TYPES.BELOW && "border-b-2 border-primary pb-1",
            dragOverItemId === document.channelId && dragPosition === DRAG_TYPES.INTO && "bg-primary/10 rounded-md"
          )}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, document.channelId)}
          onDragOver={(e) => handleDragOver(e, document.channelId)}
          onDragLeave={(e) => handleDragLeave(e, document.channelId)}
          onDrop={(e) => handleDrop(e, document.channelId)}
          onDragEnd={handleDragEnd}
        >
          <NavItem
            id={document.channelId}
            onClick={() => onRedirect(document.channelId)}
            onExpand={() => onExpand(document.channelId)}
            label={document.name || 'Untitled'}
            documentIcon={document.icon}
            expanded={expandedIds.includes(document.channelId)}
            icon={Icons.document}
            level={level}
            updatedAt={document.updatedAt}
          />
          {expandedIds.includes(document.channelId) && (
            <DocumentList level={level + 1} appId={document.channelId} />
          )}
        </div>
      ))}
    </>
  );
};
