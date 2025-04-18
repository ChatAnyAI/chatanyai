import { aiValue } from '@/registry/default/example/ai-value';
import { basicElementsValue } from '@/registry/default/example/basic-elements-value';
import { basicMarksValue } from '@/registry/default/example/basic-marks-value';
import { basicNodesValue } from '@/registry/default/example/basic-nodes-value';
import { blockMenuValue } from '@/registry/default/example/block-menu-value';
import { calloutValue } from '@/registry/default/example/callout-value';
import { columnValue } from '@/registry/default/example/column-value';
import { commentsValue } from '@/registry/default/example/comments-value';
import { copilotValue } from '@/registry/default/example/copilot-value';
import { dateValue } from '@/registry/default/example/date-value';
import { dndValue } from '@/registry/default/example/dnd-value';
import { emojiValue } from '@/registry/default/example/emoji-value';
import { equationValue } from '@/registry/default/example/equation-value';
import { floatingToolbarValue } from '@/registry/default/example/floating-toolbar-value';
import { horizontalRuleValue } from '@/registry/default/example/horizontal-rule-value';
import { linkValue } from '@/registry/default/example/link-value';
import { mediaToolbarValue } from '@/registry/default/example/media-toolbar-value';
import { mediaValue } from '@/registry/default/example/media-value';
import { mentionValue } from '@/registry/default/example/mention-value';
import { selectionValue } from '@/registry/default/example/selection-value';
import { slashMenuValue } from '@/registry/default/example/slash-menu-value';
import { tableValue } from '@/registry/default/example/table-value';
import { uploadValue } from '@/registry/default/example/upload-value';

const values = {
  'ai-demo': aiValue,
  'basic-elements-demo': basicElementsValue,
  'basic-marks-demo': basicMarksValue,
  'basic-nodes-demo': basicNodesValue,
  'block-menu-demo': blockMenuValue,
  'block-selection-demo': selectionValue,
  'callout-demo': calloutValue,
  'column-demo': columnValue,
  'comments-demo': commentsValue,
  'copilot-demo': copilotValue,
  'date-demo': dateValue,
  'dnd-demo': dndValue,
  'emoji-demo': emojiValue,
  'equation-demo': equationValue,
  'floating-toolbar-demo': floatingToolbarValue,
  // 'font-demo': fontValue,
  'horizontal-rule-demo': horizontalRuleValue,
  'link-demo': linkValue,
  // 'list-demo': listValue,
  'media-demo': mediaValue,
  'media-toolbar-demo': mediaToolbarValue,
  'mention-demo': mentionValue,
  'slash-menu-demo': slashMenuValue,
  'table-demo': tableValue,
  'upload-demo': uploadValue,
};

export const DEMO_VALUES = Object.entries(values).reduce(
  (acc, [key, value]) => {
    const demoKey = key.replace('Value', '-demo');
    acc[demoKey] = value;

    return acc;
  },
  {} as Record<string, any>
);
