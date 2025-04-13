'use client';

import type { Value } from '@udecode/plate';

import { withProps } from '@udecode/cn';
import { AIPlugin } from '@udecode/plate-ai/react';
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from '@udecode/plate-basic-marks/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CalloutPlugin } from '@udecode/plate-callout/react';
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from '@udecode/plate-code-block/react';
import { CommentsPlugin } from '@udecode/plate-comments/react';
import { DatePlugin } from '@udecode/plate-date/react';
import { EmojiInputPlugin } from '@udecode/plate-emoji/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { TocPlugin } from '@udecode/plate-heading/react';
import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { ColumnItemPlugin, ColumnPlugin } from '@udecode/plate-layout/react';
import { LinkPlugin } from '@udecode/plate-link/react';
import {
  EquationPlugin,
  InlineEquationPlugin,
} from '@udecode/plate-math/react';
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from '@udecode/plate-media/react';
import {
  MentionInputPlugin,
  MentionPlugin,
} from '@udecode/plate-mention/react';
import { SlashInputPlugin } from '@udecode/plate-slash-command/react';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from '@udecode/plate-table/react';
import { TogglePlugin } from '@udecode/plate-toggle/react';
import {
  type CreatePlateEditorOptions,
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from '@udecode/plate/react';

import { blockSelectionScrollPlugin } from '@/components/editor-pro/components/editor/plugins/block-selection-plugin';
import { copilotPlugins } from '@/components/editor-pro/components/editor/plugins/copilot-plugins';
import {
  editorPlugins,
  viewPlugins,
} from '@/components/editor-pro/components/editor/plugins/editor-plugins';
import { CommentLeaf } from '@/components/editor-pro/potion-ui/comment-leaf';
import { AILeaf } from '@/components/editor-pro/potion-ui/ai-leaf';
import { BlockquoteElement } from '@/components/editor-pro/potion-ui/blockquote-element';
import { CalloutElement } from '@/components/editor-pro/potion-ui/callout-element';
import { CodeBlockElement } from '@/components/editor-pro/potion-ui/code-block-element';
import { CodeLeaf } from '@/components/editor-pro/potion-ui/code-leaf';
import { CodeLineElement } from '@/components/editor-pro/potion-ui/code-line-element';
import { CodeSyntaxLeaf } from '@/components/editor-pro/potion-ui/code-syntax-leaf';
import { ColumnElement } from '@/components/editor-pro/potion-ui/column-element';
import { ColumnGroupElement } from '@/components/editor-pro/potion-ui/column-group-element';
import { DateElement } from '@/components/editor-pro/potion-ui/date-element';
import { EmojiInputElement } from '@/components/editor-pro/potion-ui/emoji-input-element';
import { EquationElement } from '@/components/editor-pro/potion-ui/equation-element';
import { HeadingElement } from '@/components/editor-pro/potion-ui/heading-element';
import { HrElement } from '@/components/editor-pro/potion-ui/hr-element';
import { ImageElement } from '@/components/editor-pro/potion-ui/image-element';
import { InlineEquationElement } from '@/components/editor-pro/potion-ui/inline-equation-element';
import { LinkElement } from '@/components/editor-pro/potion-ui/link-element';
import { MediaAudioElement } from '@/components/editor-pro/potion-ui/media-audio-element';
import { MediaEmbedElement } from '@/components/editor-pro/potion-ui/media-embed-element';
import { MediaFileElement } from '@/components/editor-pro/potion-ui/media-file-element';
import { MediaPlaceholderElement } from '@/components/editor-pro/potion-ui/media-placeholder-element';
import { MediaVideoElement } from '@/components/editor-pro/potion-ui/media-video-element';
import { MentionElement } from '@/components/editor-pro/potion-ui/mention-element';
import { MentionInputElement } from '@/components/editor-pro/potion-ui/mention-input-element';
import { ParagraphElement } from '@/components/editor-pro/potion-ui/paragraph-element';
import { withPlaceholders } from '@/components/editor-pro/potion-ui/placeholder';
import { SlashInputElement } from '@/components/editor-pro/potion-ui/slash-input-element';
import { SuggestionLeaf } from '@/components/editor-pro/potion-ui/suggestion-leaf';
import {
  TableCellElement,
  TableCellHeaderElement,
} from '@/components/editor-pro/potion-ui/table-cell-element';
import { TableElement } from '@/components/editor-pro/potion-ui/table-element';
import { TableRowElement } from '@/components/editor-pro/potion-ui/table-row-element';
import { TocElement } from '@/components/editor-pro/potion-ui/toc-element';
import { ToggleElement } from '@/components/editor-pro/potion-ui/toggle-element';

export const viewComponents = {
  [AudioPlugin.key]: MediaAudioElement,
  [BlockquotePlugin.key]: BlockquoteElement,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: 'strong' }),
  [CalloutPlugin.key]: CalloutElement,
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodePlugin.key]: CodeLeaf,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  [ColumnItemPlugin.key]: ColumnElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [CommentsPlugin.key]: CommentLeaf,
  [DatePlugin.key]: DateElement,
  [EquationPlugin.key]: EquationElement,
  [FilePlugin.key]: MediaFileElement,
  [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: 'h1' }),
  [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: 'h2' }),
  [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: 'h3' }),
  [HorizontalRulePlugin.key]: HrElement,
  [ImagePlugin.key]: ImageElement,
  [InlineEquationPlugin.key]: InlineEquationElement,
  [ItalicPlugin.key]: withProps(PlateLeaf, { as: 'em' }),
  [LinkPlugin.key]: LinkElement,
  [MediaEmbedPlugin.key]: MediaEmbedElement,
  [MentionPlugin.key]: MentionElement,
  [ParagraphPlugin.key]: ParagraphElement,
  [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: 's' }),
  [SuggestionPlugin.key]: SuggestionLeaf,
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElement,
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  [TocPlugin.key]: TocElement,
  [TogglePlugin.key]: ToggleElement,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: 'u' }),
  [VideoPlugin.key]: MediaVideoElement,
};

export const editorComponents = {
  ...viewComponents,
  [AIPlugin.key]: AILeaf,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [MentionInputPlugin.key]: MentionInputElement,
  [PlaceholderPlugin.key]: MediaPlaceholderElement,
  [SlashInputPlugin.key]: SlashInputElement,
};

export const useCreateEditor = (
  {
    readOnly,
    ...options
  }: CreatePlateEditorOptions<Value, any> & { readOnly?: boolean } = {},
  deps: any[] = []
) => {
  return usePlateEditor<Value, (typeof editorPlugins)[number]>(
    {
      override: {
        components: readOnly
          ? viewComponents
          : withPlaceholders(editorComponents),
      },
      plugins: [
        ...(readOnly
          ? viewPlugins
          : [...copilotPlugins, ...editorPlugins, blockSelectionScrollPlugin]),
      ],
      ...options,
    },
    deps
  );
};
