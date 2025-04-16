import React, { useState } from 'react';
import { Button } from '@/components/editor-pro/potion-ui/button';
import { Icons } from '../ui/icons';
import { DocumentList } from './document-list';
import { NavItem } from './nav-item';
import { useChatStore } from '@/store/chatStore';
import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar';
import { cn } from '@/lib/utils';
import { CreateSpace } from './create-space';
import { ApiCreateDoc } from '@/service/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AppType, RouteEnum } from '@/lib/constants/constants';
import { useTranslation } from 'react-i18next';
import { useSWRConfig } from 'swr';

export function Notespace({ className }: React.HTMLAttributes<HTMLElement>) {
  const notespaceList = useChatStore((state) => state.notespaceList);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const [collapsedState, setCollapsedState] = useState<Record<string, boolean>>({});

  const toggleCollapse = (id: string) => {
    setCollapsedState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const onCreate = async (appId: string) => {
    try {
      const resp = await ApiCreateDoc(appId!);
      navigate(`/${RouteEnum[AppType.Note]}/${appId}/c/${resp.guid}`);
      mutate([`ApiDocList`, appId]);
    } catch (error) {
      toast({
        title: t('note-doc-list.Create Fail'),
        description: t('note-doc-list.Create Fail'),
        variant: 'destructive'
      });
    }
  };

  return (
    <SidebarGroup className={className}>
      <div className="flex items-center justify-between pr-2">
        <div
          className={cn("flex items-center justify-between w-full group",)}
        >
          <div className="flex items-center">
            <SidebarGroupLabel>Notespace</SidebarGroupLabel>
          </div>
          <CreateSpace />
        </div>
      </div>
      {
        notespaceList.length > 0 && notespaceList.map((item) => {
          const isCollapsed = collapsedState[item.id!] || false;
          return <div key={item.id} className="space-y-0.5">
            <NavItem
              className="text-xs"
              onClick={() => toggleCollapse(item.id!)}
              label={
                <div className="flex items-center">
                  <Button
                    size="navAction"
                    variant="navAction"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(item.id!);
                    }}
                    tooltip={isCollapsed ? "Expand" : "Collapse"}
                    tooltipContentProps={{
                      side: 'right',
                    }}
                    className="mr-1"
                  >
                    <Icons.chevronRight 
                      variant="muted" 
                      className={cn("h-4 w-4 transition-transform", 
                        !isCollapsed && "transform rotate-90"
                      )} 
                    />
                  </Button>
                  <span>{item.name}</span>
                </div>
              }
            >
              <Button
                size="navAction"
                variant="navAction"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreate(item.id!);
                }}
                tooltip="Create a new page"
                tooltipContentProps={{
                  side: 'right',
                }}
              >
                <Icons.plus variant="muted" />
              </Button>
            </NavItem>

            {!isCollapsed && <DocumentList appId={item.id!} />}
          </div>
        })
      }
    </SidebarGroup>
  );
}
