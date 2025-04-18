/** @jsxRuntime/** @jsxRuntime classic */
/** @jsx jsx */

import { HorizontalRulePlugin } from '@udecode/plate-horizontal-rule/react';
import { jsx } from '@udecode/plate-test-utils';

jsx;

export const horizontalRuleValue: any = (
  <fragment>
    <hh2>Horizontal Rule</hh2>
    <hp>
      Add horizontal rules to visually separate sections and content within your
      document.
    </hp>
    <hp>How to use horizontal rules:</hp>
    <hp indent={1} listStyleType="disc">
      <htext>Type "---" to insert a horizontal rule.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>
        To delete a horizontal rule, click on it and press "Backspace".
      </htext>
    </hp>
    <element type={HorizontalRulePlugin.key}>
      <htext />
    </element>
    <hp>
      <htext />
    </hp>
  </fragment>
);
