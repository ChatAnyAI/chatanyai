'use client';

import emojiMartData, { type EmojiMartData } from '@emoji-mart/data';
import { EmojiPlugin } from '@udecode/plate-emoji/react';

export const emojiPlugin = EmojiPlugin.configure({
  options: {
    data: emojiMartData as EmojiMartData,
  },
});
