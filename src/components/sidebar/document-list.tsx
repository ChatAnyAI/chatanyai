'use client';

import { cn } from '@udecode/cn';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../ui/icons';
import { NavItem } from './nav-item';
import { ApiDocList, DocInfo } from '@/service/api';
import useSWR from 'swr';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppType, RouteEnum } from '@/lib/constants/constants';

const STORAGE_KEY = 'sidebar-expanded-state';

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
  const { data: documents, isLoading } = useSWR(appId ? ['ApiDocList', appId] : null, () => ApiDocList(appId))

  const [expandedIds, setExpandedIds] = useLocalStorage<string[]>(
    STORAGE_KEY,
    []
  );

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
        <div key={document.channelId} className="space-y-0.5">
          <NavItem
            id={document.channelId}
            onClick={() => onRedirect(document.channelId)}
            onExpand={() => onExpand(document.channelId)}
            label={document.name || 'Untitled'}
            // active={documentId === document.channelId}
            documentIcon={document.icon}
            expanded={expandedIds.includes(document.channelId)}
            icon={Icons.document}
            level={level}
            updatedAt={document.updatedAt}
          />
          {expandedIds.includes(document.channelId) && (
            // to display all the child documents under a parent document
            // all the documents with that parent document id
            <DocumentList level={level + 1} appId={document.channelId} />
          )}
        </div>
      ))}
    </>
  );
};
