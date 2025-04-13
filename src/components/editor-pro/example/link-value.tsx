/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@udecode/plate-test-utils';

jsx;

export const linkValue: any = (
  <fragment>
    <hh2>🔗 Link</hh2>
    <hp>
      Add hyperlinks to your text to reference external sources or provide
      additional information.
    </hp>
    <hp>How to use links:</hp>
    <hp indent={1} listStyleType="disc">
      <htext>Press "⌘ + K" to trigger the floating link menu.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>
        Enter the URL (must be a valid http:// or https:// address) and the text
        to display.
      </htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Use "Tab" to switch between URL and display text fields.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Press Enter to insert the link.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>
        Select text before pressing "⌘ + K" to pre-fill the display text.
      </htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>
        Use the floating toolbar's link button when text is selected.
      </htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Click on an existing link to edit, visit, or remove it.</htext>
    </hp>
  </fragment>
);
