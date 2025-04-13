'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import { NodeApi } from '@udecode/plate';
import { PlateElement } from '@udecode/plate/react';
import { FilesIcon } from 'lucide-react';

import { useCopyToClipboard } from '@/components/editor-pro/hooks/use-copy-to-clipboard';

import { BlockActionButton } from './block-context-menu';
import { Button } from './button';
import { CodeBlockCombobox } from './code-block-combobox';

export function CodeBlockElement({
  children,
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const { element } = props;
  const { copyToClipboard } = useCopyToClipboard();

  return (
    <PlateElement
      className={cn(
        className,
        'group my-1',
        '**:[.hljs-comment,.hljs-code,.hljs-formula]:text-[#6a737d]',
        '**:[.hljs-keyword,.hljs-doctag,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_]:text-[#d73a49]',
        '**:[.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_]:text-[#6f42c1]',
        '**:[.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable]:text-[#005cc5]',
        '**:[.hljs-regexp,.hljs-string,.hljs-meta_.hljs-string]:text-[#032f62]',
        '**:[.hljs-built_in,.hljs-symbol]:text-[#e36209]',
        '**:[.hljs-name,.hljs-quote,.hljs-selector-tag,.hljs-selector-pseudo]:text-[#22863a]',
        '**:[.hljs-emphasis]:italic',
        '**:[.hljs-strong]:font-bold',
        '**:[.hljs-section]:font-bold **:[.hljs-section]:text-[#005cc5]',
        '**:[.hljs-bullet]:text-[#735c0f]',
        '**:[.hljs-addition]:bg-[#f0fff4] **:[.hljs-addition]:text-[#22863a]',
        '**:[.hljs-deletion]:bg-[#ffeef0] **:[.hljs-deletion]:text-[#b31d28]'
      )}
      {...props}
    >
      <pre
        className="overflow-x-auto rounded-md bg-muted pt-[34px] pr-4 pb-8 pl-8 font-mono text-sm leading-[normal] [tab-size:2] print:break-inside-avoid"
        data-plate-open-context-menu
      >
        <code>{children}</code>
      </pre>

      <div className="absolute top-2 left-2 z-10 h-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <CodeBlockCombobox />
      </div>

      <div
        className="absolute top-1 right-1 z-10 flex gap-px opacity-0 transition-opacity duration-300 select-none group-hover:opacity-100"
        contentEditable={false}
      >
        <Button
          size="blockAction"
          variant="blockActionSecondary"
          className="relative top-0 right-0 w-auto"
          onClick={() => {
            const lines = element.children.map((child) =>
              NodeApi.string(child)
            );
            copyToClipboard(lines.join('\n\n'), {
              tooltip: 'Copied code to clipboard',
            });
          }}
        >
          <FilesIcon className="size-3.5" />
          Copy
        </Button>

        <BlockActionButton
          variant="blockActionSecondary"
          defaultStyles={false}
        />
      </div>
    </PlateElement>
  );
}
