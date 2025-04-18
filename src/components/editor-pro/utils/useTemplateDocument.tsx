/* eslint-disable perfectionist/sort-objects */
import type { Value } from '@udecode/plate';

import { useDocumentId } from '@/hooks/use-document-id';
import { aiValue } from '@/components/editor-pro/example/ai-value';
import { blockMenuValue } from '@/components/editor-pro/example/block-menu-value';
import { calloutValue } from '@/components/editor-pro/example/callout-value';
import { copilotValue } from '@/components/editor-pro/example/copilot-value';
import { equationValue } from '@/components/editor-pro/example/equation-value';
import { floatingToolbarValue } from '@/components/editor-pro/example/floating-toolbar-value';
import { mediaToolbarValue } from '@/components/editor-pro/example/media-toolbar-value';
import { slashMenuValue } from '@/components/editor-pro/example/slash-menu-value';
import { tocValue } from '@/components/editor-pro/example/toc-value';
import { uploadValue } from '@/components/editor-pro/example/upload-value';

export interface TemplateDocument {
  id: string;
  icon: string | null;
  title: string | null;
  value: Value;
}

const templates: Record<string, TemplateDocument> = {
  playground: {
    id: 'playground',
    icon: '🌳',
    title: 'Playground',
    value: [
      ...tocValue,
      ...aiValue,
      ...copilotValue,
      ...calloutValue,
      ...equationValue,
      ...uploadValue,
      ...slashMenuValue,
      ...blockMenuValue,
      ...floatingToolbarValue,
      ...mediaToolbarValue,
    ],
  },
  ai: {
    id: 'ai',
    icon: '🧠',
    title: 'AI',
    value: aiValue,
  },
  copilot: {
    id: 'copilot',
    icon: '🤖',
    title: 'Copilot',
    value: copilotValue,
  },
  callout: {
    id: 'callout',
    icon: '📢',
    title: 'Callout',
    value: calloutValue,
  },
  equation: {
    id: 'equation',
    icon: '🧮',
    title: 'Equation',
    value: equationValue,
  },
  upload: {
    id: 'upload',
    icon: '📤',
    title: 'Upload',
    value: uploadValue,
  },
  'slash-menu': {
    id: 'slash-menu',
    icon: '/',
    title: 'Slash Menu',
    value: slashMenuValue,
  },
  'block-menu': {
    id: 'block-menu',
    icon: '📋',
    title: 'Block Menu',
    value: blockMenuValue,
  },
  'floating-toolbar': {
    id: 'floating-toolbar',
    icon: '🧰',
    title: 'Floating Toolbar',
    value: floatingToolbarValue,
  },
  'media-toolbar': {
    id: 'media-toolbar',
    icon: '🎮',
    title: 'Media Toolbar',
    value: mediaToolbarValue,
  },
  'table-of-contents': {
    id: 'table-of-contents',
    icon: '📚',
    title: 'Table of Contents',
    value: tocValue,
  },
};

export const templateList = Object.values(templates);

export const getTemplateDocument = (documentId: string) => {
  return templates[documentId];
};

export const useTemplateDocument = () => {
  const documentId = useDocumentId();

  return getTemplateDocument(documentId);
};

export const isTemplateDocument = (documentId: string) => {
  return !!templates[documentId];
};
