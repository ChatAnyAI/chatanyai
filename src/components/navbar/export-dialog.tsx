'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';

import type { InferRequestType, InferResponseType } from 'hono/client';
import type { PaperFormat } from 'puppeteer';

import { useMutation, useQuery } from '@tanstack/react-query';
import { withProps } from '@udecode/cn';
import {
  BaseParagraphPlugin,
  createSlateEditor,
  serializeHtml,
  SlateLeaf,
} from '@udecode/plate';
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { BaseBlockquotePlugin } from '@udecode/plate-block-quote';
import { BaseCalloutPlugin } from '@udecode/plate-callout';
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from '@udecode/plate-code-block';
import { BaseCommentsPlugin } from '@udecode/plate-comments';
import { BaseDatePlugin } from '@udecode/plate-date';
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from '@udecode/plate-font';
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from '@udecode/plate-heading';
import { BaseHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { BaseIndentPlugin } from '@udecode/plate-indent';
import { BaseIndentListPlugin } from '@udecode/plate-indent-list';
import { BaseColumnItemPlugin, BaseColumnPlugin } from '@udecode/plate-layout';
import { BaseLinkPlugin } from '@udecode/plate-link';
import { MarkdownPlugin } from '@udecode/plate-markdown';
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from '@udecode/plate-math';
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from '@udecode/plate-media';
import { BaseMentionPlugin } from '@udecode/plate-mention';
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from '@udecode/plate-table';
import { BaseTogglePlugin } from '@udecode/plate-toggle';
import { useEditorRef } from '@udecode/plate/react';
import { all, createLowlight } from 'lowlight';
import { toast } from 'sonner';

import { useDocumentId } from '@/hooks/use-document-id';
import { downloadFile } from '@/components/editor-pro/lib/download-file';
import { BlockquoteElementStatic } from '@/components/editor-pro/potion-ui/blockquote-element-static';
import { Button } from '@/components/editor-pro/potion-ui/button';
import { CalloutElementStatic } from '@/components/editor-pro/potion-ui/callout-element-static';
import { CodeBlockElementStatic } from '@/components/editor-pro/potion-ui/code-block-element-static';
import { CodeLeafStatic } from '@/components/editor-pro/potion-ui/code-leaf-static';
import { CodeLineElementStatic } from '@/components/editor-pro/potion-ui/code-line-element-static';
import { CodeSyntaxLeafStatic } from '@/components/editor-pro/potion-ui/code-syntax-leaf-static';
import { ColumnElementStatic } from '@/components/editor-pro/potion-ui/column-element-static';
import { ColumnGroupElementStatic } from '@/components/editor-pro/potion-ui/column-group-element-static';
// import { CommentLeafStatic } from '@/components/editor-pro/potion-ui/comment-leaf-static';
import { DateElementStatic } from '@/components/editor-pro/potion-ui/date-element-static';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/editor-pro/potion-ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/editor-pro/potion-ui/dropdown-menu';
import { EditorStatic } from '@/components/editor-pro/potion-ui/editor-static';
import { EquationElementStatic } from '@/components/editor-pro/potion-ui/equation-element-static';
import { HeadingElementStatic } from '@/components/editor-pro/potion-ui/heading-element-static';
import { HrElementStatic } from '@/components/editor-pro/potion-ui/hr-element-static';
import { ImageElementStatic } from '@/components/editor-pro/potion-ui/image-element-static';
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from '@/components/editor-pro/potion-ui/indent-todo-marker-static';
import { InlineEquationElementStatic } from '@/components/editor-pro/potion-ui/inline-equation-element-static';
import { Input } from '@/components/editor-pro/potion-ui/input';
import { LinkElementStatic } from '@/components/editor-pro/potion-ui/link-element-static';
import { MediaAudioElementStatic } from '@/components/editor-pro/potion-ui/media-audio-element-static';
import { MediaFileElementStatic } from '@/components/editor-pro/potion-ui/media-file-element-static';
import { MediaVideoElementStatic } from '@/components/editor-pro/potion-ui/media-video-element-static';
import { MentionElementStatic } from '@/components/editor-pro/potion-ui/mention-element-static';
import { ParagraphElementStatic } from '@/components/editor-pro/potion-ui/paragraph-element-static';
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from '@/components/editor-pro/potion-ui/table-cell-element-static';
import { TableElementStatic } from '@/components/editor-pro/potion-ui/table-element-static';
import { TableRowElementStatic } from '@/components/editor-pro/potion-ui/table-row-element-static';
import { TocElementStatic } from '@/components/editor-pro/potion-ui/toc-element-static';
import { ToggleElementStatic } from '@/components/editor-pro/potion-ui/toggle-element-static';
import { honoApi } from '@/lib/hono-client';
import { useDocumentQueryOptions } from '@/trpc/hooks/query-options';

import { Icons } from '../ui/icons';
import { Label } from '../ui/label';
import { TEXT_STYLE_ITEMS } from './document-menu';

const $post = honoApi.export.pdf.$post;
const $get = honoApi.export.html.$get;

export function ExportDialog() {
  const editor = useEditorRef();

  const [type, setType] = useState('pdf');
  const [pageFormat, setPageFormat] = useState<PaperFormat>('a4');
  const [scale, setScale] = useState('100');
  const [isExporting, setIsExporting] = useState(false);
  const [includeMedia, setIncludeMedia] = useState(true);

  const documentId = useDocumentId();
  const { data: title } = useQuery({
    ...useDocumentQueryOptions(),
    select: (data) => data.document?.title,
  });

  const exportPdf = useMutation<
    InferResponseType<typeof $post>,
    Error,
    InferRequestType<typeof $post>
  >({
    mutationFn: async (input) => {
      const res = await $post(input);

      if (!res.ok) {
        const error = await res.json();

        throw new Error((error as any).message);
      }

      return await res.blob();
    },
    onError: () => {
      toast.error('Failed to export PDF');
    },
    onMutate: () => {
      setIsExporting(true);
    },
    onSettled: () => {
      setIsExporting(false);
    },
    onSuccess: async (blob: any) => {
      const url = window.URL.createObjectURL(blob);
      await downloadFile(url, `${title}.${type}`);
    },
  });

  const handleExport = () => {
    exportPdf.mutate({
      json: {
        disableMedia: !includeMedia,
        documentId,
        format: pageFormat,
        scale: Number(scale) / 100,
      },
    });
  };

  const queryOptions = useDocumentQueryOptions();

  const { data: textStyle } = useQuery({
    ...queryOptions,
    select: (data) => data.document?.textStyle,
  });

  const fontFamily = useMemo(
    () => ({
      fontFamily: TEXT_STYLE_ITEMS.find((item) => item.key === textStyle)
        ?.fontFamily,
    }),
    [textStyle]
  );
  const exportHtml = useMutation<
    InferResponseType<typeof $get>,
    Error,
    InferRequestType<typeof $get>
  >({
    mutationFn: async () => {
      const res = await $get();

      if (!res.ok) {
        const error = await res.json();

        throw new Error((error as any).message);
      }

      return await res.text();
    },
    onError: () => {
      toast.error('Failed to export PDF');
    },
    onMutate: () => {
      setIsExporting(true);
    },
    onSettled: () => {
      setIsExporting(false);
    },
    onSuccess: async (css: any) => {
      const mediaComponents = {
        [BaseAudioPlugin.key]: MediaAudioElementStatic,
        [BaseFilePlugin.key]: MediaFileElementStatic,
        [BaseImagePlugin.key]: ImageElementStatic,
        [BaseVideoPlugin.key]: MediaVideoElementStatic,
      };

      const basicComponents = {
        [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
        [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: 'strong' }),
        [BaseCalloutPlugin.key]: CalloutElementStatic,
        [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
        [BaseCodeLinePlugin.key]: CodeLineElementStatic,
        [BaseCodePlugin.key]: CodeLeafStatic,
        [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
        [BaseColumnItemPlugin.key]: ColumnElementStatic,
        [BaseColumnPlugin.key]: ColumnGroupElementStatic,
        // [BaseCommentsPlugin.key]: CommentLeafStatic,
        [BaseDatePlugin.key]: DateElementStatic,
        [BaseEquationPlugin.key]: EquationElementStatic,
        [BaseHorizontalRulePlugin.key]: HrElementStatic,
        [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
        [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: 'em' }),
        [BaseLinkPlugin.key]: LinkElementStatic,
        [BaseMentionPlugin.key]: MentionElementStatic,
        [BaseParagraphPlugin.key]: ParagraphElementStatic,
        [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: 'del' }),
        [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: 'sub' }),
        [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: 'sup' }),
        [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
        [BaseTableCellPlugin.key]: TableCellElementStatic,
        [BaseTablePlugin.key]: TableElementStatic,
        [BaseTableRowPlugin.key]: TableRowElementStatic,
        [BaseTocPlugin.key]: TocElementStatic,
        [BaseTogglePlugin.key]: ToggleElementStatic,
        [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: 'u' }),
        [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: 'h1' }),
        [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: 'h2' }),
        [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: 'h3' }),
      };

      const staticComponents = includeMedia
        ? {
            ...mediaComponents,
            ...basicComponents,
          }
        : basicComponents;

      const editorStatic = createSlateEditor({
        plugins: [
          BaseEquationPlugin,
          BaseColumnPlugin,
          BaseColumnItemPlugin,
          BaseTocPlugin,
          BaseVideoPlugin,
          BaseAudioPlugin,
          BaseParagraphPlugin,
          BaseHeadingPlugin,
          BaseMediaEmbedPlugin,
          BaseInlineEquationPlugin,
          BaseBoldPlugin,
          BaseCodePlugin,
          BaseItalicPlugin,
          BaseStrikethroughPlugin,
          BaseSubscriptPlugin,
          BaseSuperscriptPlugin,
          BaseUnderlinePlugin,
          BaseBlockquotePlugin,
          BaseDatePlugin,
          BaseCalloutPlugin,
          BaseCodeBlockPlugin.configure({
            options: {
              lowlight: createLowlight(all),
            },
          }),
          BaseIndentPlugin.extend({
            inject: {
              targetPlugins: [
                BaseParagraphPlugin.key,
                BaseBlockquotePlugin.key,
                BaseCodeBlockPlugin.key,
              ],
            },
          }),
          BaseIndentListPlugin.extend({
            inject: {
              targetPlugins: [
                BaseParagraphPlugin.key,
                ...HEADING_LEVELS,
                BaseBlockquotePlugin.key,
                BaseCodeBlockPlugin.key,
                BaseTogglePlugin.key,
              ],
            },
            options: {
              listStyleTypes: {
                todo: {
                  liComponent: TodoLiStatic,
                  markerComponent: TodoMarkerStatic,
                  type: 'todo',
                },
              },
            },
          }),
          BaseLinkPlugin,
          BaseTableRowPlugin,
          BaseTablePlugin,
          BaseTableCellPlugin,
          BaseHorizontalRulePlugin,
          BaseFontColorPlugin,
          BaseFontBackgroundColorPlugin,
          BaseFontSizePlugin,
          BaseFilePlugin,
          BaseImagePlugin,
          BaseMentionPlugin,
          BaseCommentsPlugin,
          BaseTogglePlugin,
        ],
        value: editor.children,
      });

      const editorHtml = await serializeHtml(editorStatic, {
        components: staticComponents,
        editorComponent: EditorStatic,
        props: {
          style: {
            padding: '0 calc(50% - 350px)',
            paddingBottom: '',
            ...fontFamily,
          },
        },
      });

      const tailwindCss = `<link rel="stylesheet" href="${''}/css/tailwind.css">`;
      const katexCss = `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.18/dist/katex.css" integrity="sha384-9PvLvaiSKCPkFKB1ZsEoTjgnJn+O3KvEwtsz37/XrkYft3DTk2gHdYvd9oWgW3tV" crossorigin="anonymous">`;

      const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="color-scheme" content="light" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap"
            rel="stylesheet"
          />
          <style>
            :root {
              --font-sans: 'Inter', sans-serif;
              --font-mono: 'JetBrains Mono', monospace;
            }
          ${css}
          </style>
          ${tailwindCss}
          ${katexCss}
        </head>
        <body>
          ${editorHtml}
        </body>
      </html>`;

      const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;

      void downloadFile(url, 'plate.html');
    },
  });

  const handleExportHtml = () => {
    exportHtml.mutate({});
  };

  const handleExportMarkdown = async () => {
    const md = editor.getApi(MarkdownPlugin).markdown.serialize();
    const url = `data:text/markdown;charset=utf-8,${encodeURIComponent(md)}`;
    await downloadFile(url, 'potion.md');
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(e.target.value);
  };

  return (
    <DialogContent className="px-10 md:max-w-[445px]">
      <DialogHeader>
        <DialogTitle>Export</DialogTitle>
        <DialogDescription>Choose your export preferences</DialogDescription>
      </DialogHeader>
      <div className="grid gap-2 py-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="format">Export format</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isExporting}>
              <Button variant="ghost" className="ml-auto w-fit justify-between">
                {type.toUpperCase()}
                <Icons.chevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-32 py-1">
              <DropdownMenuItem onClick={() => setType('pdf')}>
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setType('html')}>
                HTML
              </DropdownMenuItem>
              <DropdownMenuItem disabled onClick={() => setType('word')}>
                Word
                <DropdownMenuShortcut>soon</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setType('markdown')}>
                Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="format">Include content</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isExporting}>
              <Button variant="ghost" className="ml-auto w-fit justify-between">
                {includeMedia ? 'Everything' : 'No files or images'}
                <Icons.chevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-32 py-1">
              <DropdownMenuItem onClick={() => setIncludeMedia(true)}>
                Everything
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIncludeMedia(false)}>
                No files or images
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {type === 'pdf' && (
          <>
            <div className="flex items-center gap-2">
              <Label htmlFor="format">Page format</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled={isExporting}>
                  <Button
                    variant="ghost"
                    className="ml-auto w-fit justify-between"
                  >
                    {pageFormat.charAt(0).toUpperCase() +
                      pageFormat.slice(1).toLowerCase()}
                    <Icons.chevronDown className="ml-2 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full min-w-32 py-1">
                  <DropdownMenuItem onClick={() => setPageFormat('a4')}>
                    A4
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageFormat('a3')}>
                    A3
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageFormat('letter')}>
                    Letter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageFormat('legal')}>
                    Legal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPageFormat('tabloid')}>
                    Tabloid
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="scale">Scale (%)</Label>
                <Input
                  id="scale"
                  className="ml-auto w-16 rounded-md border px-2 py-1 text-center"
                  disabled={isExporting}
                  value={scale}
                  onChange={handleScaleChange}
                />
              </div>
              {(Number(scale) < 10 || Number(scale) > 200) && (
                <span className="text-sm text-red-500">
                  Scale percent must be a number between 10 and 200
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <DialogFooter>
        <Button
          variant="brand"
          disabled={isExporting}
          onClick={() => {
            switch (type) {
              case 'html': {
                void handleExportHtml();

                break;
              }
              case 'markdown': {
                void handleExportMarkdown();

                break;
              }
              case 'pdf': {
                handleExport();

                break;
              }
              // No default
            }
          }}
        >
          {isExporting ? (
            <>
              <Icons.spinner className="mr-2 size-4 animate-spin" />
              Exporting...
            </>
          ) : (
            'Export file'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
