import { type ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SidebarToggleMobile({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, open, isMobile } = useSidebar();

  if (!isMobile) return null;
  return <Tooltip>
    <TooltipTrigger asChild>
      <Button
        onClick={toggleSidebar}
        variant={"outline"}
        className={`md:px-1 md:h-fit my-1.5 ${className}`}
      >
        {open ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
      </Button>
    </TooltipTrigger>
    <TooltipContent align="start">Toggle Sidebar</TooltipContent>
  </Tooltip>
}

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, open, isMobile } = useSidebar();

  if (isMobile) return null;
  return < Tooltip >
    <TooltipTrigger asChild>
      <Button
        onClick={toggleSidebar}
        variant={open ? "ghost" : "outline"}
        className={`md:px-2 md:h-fit ${className} cursor-pointer`}
      >
        {open ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
      </Button>
    </TooltipTrigger>
    <TooltipContent align="start">Toggle Sidebar</TooltipContent>
  </Tooltip >
}
