/** @jsxRuntime classic */
/** @jsx jsx */

import { jsx } from '@udecode/plate-test-utils';

jsx;

export const commentsValue: any = (
  <fragment>
    <hh2>💬 Comments</hh2>
    <hp>
      Add comments to your content to provide additional context, insights, or
      collaborate with others.
    </hp>
    <hp>How to create comments:</hp>
    <hp indent={1} listStyleType="decimal">
      <htext>Select text and press "⌘ + ⇧+ M".</htext>
    </hp>
    <hp indent={1} listStart={2} listStyleType="decimal">
      <htext>
        Use the floating toolbar: Select text, then click the "comment" button.
      </htext>
    </hp>
    <hp indent={1} listStart={3} listStyleType="decimal">
      <htext>
        Use the block menu: Select a block, then click the "comment" button.
      </htext>
    </hp>
    <hp>Using comments:</hp>
    <hp indent={1} listStyleType="disc">
      <htext>Type your comment and press "Enter" to create it.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Click anywhere to cancel comment creation.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>Access existing comments by clicking on the commented text.</htext>
    </hp>
    <hp indent={1} listStyleType="disc">
      <htext>You can reply to, resolve, edit, or delete comments.</htext>
    </hp>
    <hp>
      <htext>Try adding a comment to this text: </htext>
      <htext comment comment_1>
        Comments are a great way to collaborate!
      </htext>
    </hp>
  </fragment>
);
