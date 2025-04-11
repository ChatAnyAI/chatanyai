'use client';

import { startTransition, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import { CheckCircleFillIcon, ChevronDownIcon } from './icons';
import { RespModel } from "@/service/api";
import { useChatStore } from '@/store/chatStore';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export function ModelSelector({
  className,
}: {
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const modelResp = useChatStore(state => state.models);
  const setModelSelectedId = useChatStore(state => state.setModelSelectedId);
  const selectedModelId = useChatStore(state => state.modelSelectedId);

  const [selectedModel, setSelectedModel] = useState<RespModel>();


  useEffect(() => {
    if (modelResp) {
      setSelectedModel(modelResp?.find((model) => model.model === selectedModelId));
    }
  }, [selectedModelId, modelResp]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      {selectedModel && <DropdownMenuTrigger
        data-name="model-selector"
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-transparent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px] bg-transparent">
            <Avatar className="h-5 w-5">
                <AvatarImage src={selectedModel.icon} alt={selectedModel.label}/>
                <AvatarFallback className="bg-muted">{selectedModel.label.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{selectedModel.label}</span>
            <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>}
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {modelResp?.map((model) => (
          <DropdownMenuItem
            key={model.model}
            onSelect={() => {
              setOpen(false);

              startTransition(() => {
                setModelSelectedId(model.model);
              });
            }}
            className="gap-4 group/item flex flex-row justify-between items-center"
            data-active={model.model === selectedModelId}
          >
              <div className="flex flex-col gap-1 items-start">
                  <span className="flex">
                      <Avatar className="h-5 w-5 mr-2">
                          <AvatarImage src={model.icon} alt={model.label}/>
                          <AvatarFallback className="bg-muted">{model.label.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{model.label}</span>
                  </span>

                  {/*{model.label}*/}
                  {/*{model.label && (*/}
                  {/*    <div className="text-xs text-muted-foreground">*/}
                  {/*        {model.label}*/}
                  {/*    </div>*/}
                  {/*)}*/}
              </div>
              <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
              <CheckCircleFillIcon />
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
