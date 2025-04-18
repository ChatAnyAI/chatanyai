/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@udecode/plate-test-utils';

jsx;

export const mentionValue: any = (
  <fragment>
    <hh2>＠ Mention</hh2>
    <hp>
      Mention and reference other users or entities within your text using
      @-mentions.
    </hp>
    <hp>How to use mentions:</hp>
    <hp indent={1} listStyleType="disc">
      <htext>
        Type "@" followed by the name of the user or entity you want to mention.
      </htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Use arrow keys to navigate through the suggestion list.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Press Escape to close the menu.</htext>
    </hp>
    <hp>
      <htext>Try mentioning </htext>
      <hmention value="BB-8">
        <htext />
      </hmention>
      <htext> or </htext>
      <hmention value="Boba Fett">
        <htext />
      </hmention>
      <htext>.</htext>
    </hp>
  </fragment>
);
