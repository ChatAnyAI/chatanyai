'use client';

import { BlockSuggestion } from '@/components/editor-pro/potion-ui/block-suggestion';
import { SuggestionBelowNodes } from '@/components/editor-pro/potion-ui/suggestion-line-break';

import { ExtendedSuggestionPlugin } from './ExtendedSuggestionPlugin';

export const suggestionPlugin = ExtendedSuggestionPlugin.extend({
  render: {
    belowNodes: SuggestionBelowNodes as any,
    belowRootNodes: ({ api, element }) => {
      if (!api.suggestion!.isBlockSuggestion(element)) {
        return null;
      }

      return <BlockSuggestion element={element} />;
    },
  },
});
