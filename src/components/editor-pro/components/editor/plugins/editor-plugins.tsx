'use client';

import { CalloutPlugin } from '@udecode/plate-callout/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { DocxPlugin } from '@udecode/plate-docx';
import {
  FontBackgroundColorPlugin,
  FontColorPlugin,
} from '@udecode/plate-font/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { JuicePlugin } from '@udecode/plate-juice';
import { ColumnPlugin } from '@udecode/plate-layout/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import { SlashPlugin } from '@udecode/plate-slash-command/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import { TrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { ParagraphPlugin } from '@udecode/plate/react';

import { emojiPlugin } from '@/components/editor-pro/components/editor/plugins/emoji-plugin';

import { aiPlugins } from './ai-plugins';
import { autoformatPlugin } from './autoformat-plugin';
import { basicNodesPlugins } from './basic-nodes-plugins';
import { blockMenuPlugins } from './block-menu-plugins';
import { commentsPlugin } from './comments/comments-plugin';
import { cursorOverlayPlugin } from './cursor-overlay-plugin';
import { deletePlugins } from './delete-plugins';
import { dndPlugins } from './dnd-plugins';
import { exitBreakPlugin } from './exit-break-plugin';
import { FloatingToolbarPlugin } from './floating-toolbar-plugin';
import { indentListPlugins } from './indent-list-plugins';
import { linkPlugin } from './link-plugin';
import { markdownPlugin } from './markdown-plugin';
import { mediaPlugins } from './media-plugins';
import { mentionPlugin } from './mention-plugin';
import { resetBlockTypePlugin } from './reset-block-type-plugin';
import { softBreakPlugin } from './soft-break-plugin';
import { suggestionPlugin } from './suggestion/suggestion-plugin';
import { tablePlugin } from './table-plugin';
import { tocPlugin } from './toc-plugin';

export const viewPlugins = [
  ...basicNodesPlugins,
  HorizontalRulePlugin,
  linkPlugin,
  DatePlugin,
  mentionPlugin,
  tablePlugin,
  TogglePlugin,
  tocPlugin,
  ...mediaPlugins,
  InlineEquationPlugin,
  EquationPlugin,
  CalloutPlugin,
  ColumnPlugin,

  // Marks
  FontColorPlugin,
  FontBackgroundColorPlugin,

  // Block Style
  ...indentListPlugins,

  // Collaboration
  commentsPlugin,
  suggestionPlugin,
];

export const editorPlugins = [
  // AI
  // ...copilotPlugins,
  ...aiPlugins,

  // Nodes
  ...viewPlugins,

  // Functionality
  SlashPlugin,
  autoformatPlugin,
  cursorOverlayPlugin,
  ...blockMenuPlugins,
  ...dndPlugins,
  emojiPlugin,
  exitBreakPlugin,
  resetBlockTypePlugin,
  ...deletePlugins,
  softBreakPlugin,
  TrailingBlockPlugin.configure({
    options: { type: ParagraphPlugin.key },
  }),

  // Deserialization
  DocxPlugin,
  markdownPlugin,
  JuicePlugin,

  // UI
  FloatingToolbarPlugin,
] as const;
