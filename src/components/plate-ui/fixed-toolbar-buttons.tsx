'use client';

import React, { useEffect, useState } from 'react';

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import { HighlightPlugin } from '@udecode/plate-highlight/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import { useEditorReadOnly } from '@udecode/plate/react';
import {
  ArrowUpToLineIcon,
  BaselineIcon,
  BoldIcon,
  Code2Icon,
  HighlighterIcon,
  ItalicIcon,
  PaintBucketIcon,
  StrikethroughIcon,
  UnderlineIcon,
  WandSparklesIcon,
} from 'lucide-react';

import { MoreDropdownMenu } from '@/components/plate-ui/more-dropdown-menu';

import { AIToolbarButton } from './ai-toolbar-button';
import { AlignDropdownMenu } from './align-dropdown-menu';
import { ColorDropdownMenu } from './color-dropdown-menu';
import { CommentToolbarButton } from './comment-toolbar-button';
import { EmojiDropdownMenu } from './emoji-dropdown-menu';
import { ExportToolbarButton } from './export-toolbar-button';
import { FontSizeToolbarButton } from './font-size-toolbar-button';
import { RedoToolbarButton, UndoToolbarButton } from './history-toolbar-button';
import { ImportToolbarButton } from './import-toolbar-button';
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from './indent-list-toolbar-button';
import { IndentTodoToolbarButton } from './indent-todo-toolbar-button';
import { IndentToolbarButton } from './indent-toolbar-button';
import { InsertDropdownMenu } from './insert-dropdown-menu';
import { LineHeightDropdownMenu } from './line-height-dropdown-menu';
import { LinkToolbarButton } from './link-toolbar-button';
import { MarkToolbarButton } from './mark-toolbar-button';
import { MediaToolbarButton } from './media-toolbar-button';
import { ModeDropdownMenu } from './mode-dropdown-menu';
import { OutdentToolbarButton } from './outdent-toolbar-button';
import { TableDropdownMenu } from './table-dropdown-menu';
import { ToggleToolbarButton } from './toggle-toolbar-button';
import { ToolbarGroup } from './toolbar';
import { TurnIntoDropdownMenu } from './turn-into-dropdown-menu';

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define breakpoints for showing different toolbar groups
  const showAI = screenWidth > 480;
  const showExportImport = screenWidth > 600;
  const showFormat = screenWidth > 768;
  const showMarks = screenWidth > 900;
  const showAlignment = screenWidth > 1024;
  const showMedia = screenWidth > 1200;
  const showIndentation = screenWidth > 1300;

  return (
    <div className = "flex w-full overflow-x-auto scrollbar-thin" >
      {!readOnly && (
      <>
        <ToolbarGroup>
        <UndoToolbarButton />
        <RedoToolbarButton />
        </ToolbarGroup>

        {showAI && (
        <ToolbarGroup>
          <AIToolbarButton tooltip="AI commands">
          <WandSparklesIcon />
          </AIToolbarButton>
        </ToolbarGroup>
        )}

        {showExportImport && (
        <ToolbarGroup>
          <ExportToolbarButton>
          <ArrowUpToLineIcon />
          </ExportToolbarButton>

          <ImportToolbarButton />
        </ToolbarGroup>
        )}

        {showFormat && (
        <ToolbarGroup>
          <InsertDropdownMenu />
          <TurnIntoDropdownMenu />
          <FontSizeToolbarButton />
        </ToolbarGroup>
        )}

        {showMarks && (
        <ToolbarGroup>
          <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
          <BoldIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
          nodeType={ItalicPlugin.key}
          tooltip="Italic (⌘+I)"
          >
          <ItalicIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
          nodeType={UnderlinePlugin.key}
          tooltip="Underline (⌘+U)"
          >
          <UnderlineIcon />
          </MarkToolbarButton>

          <MarkToolbarButton
          nodeType={StrikethroughPlugin.key}
          tooltip="Strikethrough (⌘+⇧+M)"
          >
          <StrikethroughIcon />
          </MarkToolbarButton>

          <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
          <Code2Icon />
          </MarkToolbarButton>

          <ColorDropdownMenu
          nodeType={FontColorPlugin.key}
          tooltip="Text color"
          >
          <BaselineIcon />
          </ColorDropdownMenu>

          <ColorDropdownMenu
          nodeType={FontBackgroundColorPlugin.key}
          tooltip="Background color"
          >
          <PaintBucketIcon />
          </ColorDropdownMenu>
        </ToolbarGroup>
        )}

        {showAlignment && (
        <ToolbarGroup>
          <AlignDropdownMenu />

          <NumberedIndentListToolbarButton />
          <BulletedIndentListToolbarButton />
          <IndentTodoToolbarButton />
          <ToggleToolbarButton />
        </ToolbarGroup>
        )}

        {(showAlignment || showMedia) && (
        <ToolbarGroup>
          <LinkToolbarButton />
          <TableDropdownMenu />
          <EmojiDropdownMenu />
        </ToolbarGroup>
        )}

        {showMedia && (
        <ToolbarGroup>
          <MediaToolbarButton nodeType={ImagePlugin.key} />
          <MediaToolbarButton nodeType={VideoPlugin.key} />
          <MediaToolbarButton nodeType={AudioPlugin.key} />
          <MediaToolbarButton nodeType={FilePlugin.key} />
        </ToolbarGroup>
        )}

        {showIndentation && (
        <ToolbarGroup>
          <LineHeightDropdownMenu />
          <OutdentToolbarButton />
          <IndentToolbarButton />
        </ToolbarGroup>
        )}

        <ToolbarGroup>
        <MoreDropdownMenu />
        </ToolbarGroup>
      </>
      )}

      <div className="grow" />

      <ToolbarGroup>
      <MarkToolbarButton nodeType={HighlightPlugin.key} tooltip="Highlight">
        <HighlighterIcon />
      </MarkToolbarButton>
      <CommentToolbarButton />
      </ToolbarGroup>

      <ToolbarGroup>
      <ModeDropdownMenu />
      </ToolbarGroup>
    </div>
  );
}
