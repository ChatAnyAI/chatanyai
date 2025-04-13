'use client';

import { BlockDiscussion } from '@/components/editor-pro/potion-ui/block-discussion';
import { AfterEditableComments } from '@/components/editor-pro/potion-ui/floating-discussion';

import { ExtendedCommentsPlugin } from './ExtendedCommentsPlugin';

export const commentsPlugin = ExtendedCommentsPlugin.extend({
  render: {
    aboveNodes: BlockDiscussion as any,
    afterEditable: AfterEditableComments as any,
  },
});
