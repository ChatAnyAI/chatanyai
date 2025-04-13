'use client';

import { BlockquotePlugin } from '@udecode/plate-block-quote/react';
import { CodeBlockPlugin } from '@udecode/plate-code-block/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { all, createLowlight } from 'lowlight';

export const basicElementsPlugins = [
  HeadingPlugin.configure({ options: { levels: 3 } }),
  BlockquotePlugin,
  CodeBlockPlugin.configure({ options: { lowlight: createLowlight(all) } }),
] as const;
