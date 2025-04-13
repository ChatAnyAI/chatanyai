'use client';

import { BasicMarksPlugin } from '@udecode/plate-basic-marks/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';

export const basicMarksPlugins = [
  HeadingPlugin.configure({ options: { levels: 3 } }),
  BasicMarksPlugin,
] as const;
