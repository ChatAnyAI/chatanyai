'use client';

import React, { useMemo, useState } from 'react';

import { EmojiInlineIndexSearch, insertEmoji } from '@udecode/plate-emoji';
import { EmojiPlugin } from '@udecode/plate-emoji/react';
import { PlateElement, usePluginOption } from '@udecode/plate/react';

import { useDebounce } from '@/components/editor-pro/hooks/use-debounce';

import {
  InlineCombobox,
  InlineComboboxContent,
  InlineComboboxEmpty,
  InlineComboboxGroup,
  InlineComboboxInput,
  InlineComboboxItem,
} from './inline-combobox';

export function EmojiInputElement({
  className,
  ...props
}: React.ComponentProps<typeof PlateElement>) {
  const data = usePluginOption(EmojiPlugin, 'data')!;
  const { children, editor, element } = props;
  const [value, setValue] = useState('');

  const debouncedValue = useDebounce(value, 100);
  const isPending = value !== debouncedValue;

  const filteredEmojis = useMemo(() => {
    if (debouncedValue.trim().length === 0) return [];

    return EmojiInlineIndexSearch.getInstance(data)
      .search(debouncedValue.replace(/:$/, ''))
      .get();
  }, [data, debouncedValue]);

  return (
    <PlateElement as="span" data-slate-value={element.value} {...props}>
      <InlineCombobox
        value={value}
        element={element}
        filter={false}
        setValue={setValue}
        trigger=":"
        hideWhenNoValue
      >
        <InlineComboboxInput />

        <InlineComboboxContent variant="emoji">
          {!isPending && <InlineComboboxEmpty>No results</InlineComboboxEmpty>}

          <InlineComboboxGroup>
            {filteredEmojis.map((emoji) => (
              <InlineComboboxItem
                key={emoji.id}
                value={emoji.name}
                onClick={() => insertEmoji(editor, emoji)}
              >
                <div
                  style={{
                    fontFamily:
                      '"Apple Color Emoji", "Segoe UI Emoji", NotoColorEmoji, "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", EmojiSymbols',
                  }}
                >
                  {emoji.skins[0].native}
                </div>
                <div className="ml-1.5">{emoji.name}</div>
              </InlineComboboxItem>
            ))}
          </InlineComboboxGroup>
        </InlineComboboxContent>
      </InlineCombobox>

      {children}
    </PlateElement>
  );
}
