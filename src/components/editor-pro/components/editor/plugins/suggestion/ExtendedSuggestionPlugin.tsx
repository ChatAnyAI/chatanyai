'use client';

import { useEffect } from 'react';

import type { BaseSuggestionConfig } from '@udecode/plate-suggestion';
import type { UseHooks } from '@udecode/plate/react';

import { type Path, isSlateElement, isSlateString } from '@udecode/plate';
import { SuggestionPlugin } from '@udecode/plate-suggestion/react';

import { useCurrentUser } from '@/hooks/use-current-user';
import { BlockSuggestion } from '@/components/editor-pro/potion-ui/block-suggestion';

const useHooksSuggestion: UseHooks<BaseSuggestionConfig> = ({ setOption }) => {
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?.id) return;

    setOption('currentUserId', user.id);
  }, [setOption, user]);
};

export const ExtendedSuggestionPlugin = SuggestionPlugin.extend({
  options: {
    activeId: null as string | null,
    hoverId: null as string | null,
    uniquePathMap: new Map() as Map<string, Path>,
  },
}).extend({
  handlers: {
    // unset active suggestion when clicking outside of suggestion
    onClick: ({ api, event, setOption, type }) => {
      let leaf = event.target as HTMLElement;
      let isSet = false;

      const unsetActiveSuggestion = () => {
        setOption('activeId', null);
        isSet = true;
      };

      if (!isSlateString(leaf)) unsetActiveSuggestion();

      while (
        leaf.parentElement &&
        !isSlateElement(leaf.parentElement)
        //  &&        !isSlateEditor(leaf.parentElement)
      ) {
        if (leaf.classList.contains(`slate-${type}`)) {
          const suggestionEntry = api.suggestion.node({
            isText: true,
          });

          if (!suggestionEntry) {
            unsetActiveSuggestion();

            break;
          }

          const id = api.suggestion.nodeId(suggestionEntry[0]);
          setOption('activeId', id ?? null);

          isSet = true;

          break;
        }

        leaf = leaf.parentElement;
      }

      if (!isSet) unsetActiveSuggestion();
    },
  },
  render: {
    belowRootNodes: ({ api, element }) => {
      if (!api.suggestion!.isBlockSuggestion(element)) {
        return null;
      }

      return <BlockSuggestion element={element} />;
    },
  },
  useHooks: useHooksSuggestion,
});
