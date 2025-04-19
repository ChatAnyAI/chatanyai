import { SuggestionBelowNodes } from '@/components/editor-pro/potion-ui/suggestion-line-break';

import { ExtendedSuggestionPlugin } from './ExtendedSuggestionPlugin';

export const suggestionPlugin = ExtendedSuggestionPlugin.extend({
  render: { belowNodes: SuggestionBelowNodes as any },
});
