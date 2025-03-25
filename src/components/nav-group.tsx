import { MoreHorizontal, type LucideIcon } from "lucide-react"
import { Collapsible } from "@/components/ui/collapsible"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import NavMore from "./nav-more"
import { AppResp } from "@/service/api"
import { useAppSideBarHistoryListContext } from './app-sidebar';
import React from "react"
import { cn } from "@/lib/utils"
import { AppType, AppIcons } from "@/lib/constants/constants";
import { CreateSpace } from "@/components/sidebar/create-space";

export type NavMenuItem = Partial<Omit<AppResp, 'icon' | 'id'>> & {
  id?: string;
  url: string
  icon: LucideIcon | string
  isActive?: boolean
  items?: NavMenuItem[]
  type?: AppType;
  spaceId?: number;
  isFullAccess?: boolean;
}

export function NavGroup({
  showAdd,
  groupName,
  groupRoute,
  items,
  className,
  draggable = false,
  onDragEnd = () => { },
  maked = false
}: {
  maked?: boolean;
  onDragEnd?: (curSpaceId: string, targetSpaceId: string, positon: 'before' | 'after') => void;
  draggable?: boolean;
  groupRoute?: string;
  showAdd?: boolean,
  className?: string,
  groupName?: string,
  items: NavMenuItem[]
}) {
  const location = useLocation();
  const navigator = useNavigate();
  const appSideBarContext = useAppSideBarHistoryListContext();
  const { toggleMenu: onClickMenu } = appSideBarContext;

  // State to track drag operation
  const [draggedItem, setDraggedItem] = React.useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = React.useState<{ id: string, position: 'before' | 'after' } | null>(null);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, id: string) => {
    if (!draggable) return;

    e.dataTransfer.setData('text/plain', id);
    setDraggedItem(id);

    // Add a ghost image for better UX
    const dragImage = document.createElement('div');
    dragImage.textContent = items.find(item => item.id === id)?.name || '';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.className = 'px-3 py-1 bg-accent text-accent-foreground rounded-md shadow-md';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);

    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  // Handle drag over
  const handleDragOver = (dragDropRef: React.DragEvent<HTMLLIElement>, id: string) => {
      dragDropRef.preventDefault();
    if (!draggable || id === draggedItem) return;

    // Get the bounding rectangle of the hovered element
    const hoverBoundingRect = dragDropRef.currentTarget.getBoundingClientRect();
    const position = dragDropRef.clientY < hoverBoundingRect.top + hoverBoundingRect.height / 2 ? 'before' : 'after';
    setDragOverItem({ id, position });
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent<HTMLLIElement>) => {
    if (!draggable) return;
    // Only clear if we're leaving the element, not entering a child
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverItem(null);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, targetId: string) => {
    e.preventDefault();
    if (!draggable || !draggedItem || draggedItem === targetId) return;

    const position = dragOverItem?.position || 'after';
    onDragEnd(draggedItem, targetId, position);

    // Reset drag states
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Handle drag end (cleanup)
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <SidebarGroup className={className}>
      {
        groupName ?
          <div data-name={groupName} className={cn("flex items-center justify-between pr-2 group", groupRoute ? "hover:bg-accent/50 hover:shadow-sm rounded-md cursor-pointer" : "")} onClick={() => {
            if (!groupRoute) return;
            onClickMenu(null);
            navigator(groupRoute);
          }}
          >
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>
            {
              showAdd ?
                <CreateSpace />
                : null
            }
          </div>
          : null
      }

      <SidebarMenu data-name={groupName + '-sub'}>
        {items.map((item) => {
          const isDragging = draggedItem === item.id;
          const isDragOver = dragOverItem?.id === item.id;
          const dragPosition = dragOverItem?.position;

          return (
            <Collapsible
              key={item.name}
              asChild
              defaultOpen={item.isActive}
            >
              <SidebarMenuItem
                data-name={item.name}
                data-marked={maked ? 'true' : 'false'}
                draggable={draggable && Boolean(item.id)}
                onDragStart={(e) => item.id && handleDragStart(e, item.id)}
                onDragOver={(e) => item.id && handleDragOver(e, item.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => item.id && handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "relative",
                  draggable && "cursor-grab active:cursor-grabbing",
                  isDragging && "opacity-50"
                )}
              >
                {isDragOver && dragPosition === 'before' && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-500 -translate-y-0.5 z-10" />
                )}
                <SidebarMenuButton
                  isActive={new RegExp(item.url).test(location.pathname)}
                  asChild
                  tooltip={item.name}
                  onClick={() => {
                    onClickMenu(item.id ? {
                      appId: item.id,
                      name: item.name!,
                    } : null);
                  }}
                >
                  <Link to={item.url}>
                    <Icon type={item.type!} icon={item.icon} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                {
                  item.id ? (
                    <div className="flex items-center">
                      {/* <SidebarMenuAction 
                        showOnHover 
                        className="opacity-0 hover:opacity-100 transition-opacity data-[active=true]:opacity-100 mr-1" 
                        onClick={() => onItemAddClick(item)}
                      >
                        <Plus size={18} />
                      </SidebarMenuAction> */}
                      <NavMore appInfo={item as AppResp}>
                        <SidebarMenuAction
                          showOnHover
                          className="opacity-0 hover:opacity-100 transition-opacity data-[active=true]:opacity-100"
                        >
                          <MoreHorizontal size={18} />
                        </SidebarMenuAction>
                      </NavMore>
                    </div>
                  ) : null
                }
                {isDragOver && dragPosition === 'after' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 translate-y-0.5 z-10" />
                )}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}


export function Icon({ type, icon }: { type: AppType; icon: LucideIcon | string }) {
  if (!type && !icon) return null;
  const DefaultIcon = AppIcons[type!]?.icon;
  const IconJsx = icon;

  return icon === '' ?
    <DefaultIcon style={{ color: AppIcons[type!]?.color }} /> :
    typeof IconJsx === 'string' ? <span>{IconJsx}</span> : <IconJsx />
}
