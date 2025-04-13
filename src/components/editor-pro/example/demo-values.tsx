import { aiValue } from '@/components/editor-pro/example/ai-value';
import { basicElementsValue } from '@/components/editor-pro/example/basic-elements-value';
import { basicMarksValue } from '@/components/editor-pro/example/basic-marks-value';
import { basicNodesValue } from '@/components/editor-pro/example/basic-nodes-value';
import { blockMenuValue } from '@/components/editor-pro/example/block-menu-value';
import { calloutValue } from '@/components/editor-pro/example/callout-value';
import { columnValue } from '@/components/editor-pro/example/column-value';
import { commentsValue } from '@/components/editor-pro/example/comments-value';
import { copilotValue } from '@/components/editor-pro/example/copilot-value';
import { dateValue } from '@/components/editor-pro/example/date-value';
import { dndValue } from '@/components/editor-pro/example/dnd-value';
import { emojiValue } from '@/components/editor-pro/example/emoji-value';
import { equationValue } from '@/components/editor-pro/example/equation-value';
import { floatingToolbarValue } from '@/components/editor-pro/example/floating-toolbar-value';
import { horizontalRuleValue } from '@/components/editor-pro/example/horizontal-rule-value';
import { linkValue } from '@/components/editor-pro/example/link-value';
import { mediaToolbarValue } from '@/components/editor-pro/example/media-toolbar-value';
import { mediaValue } from '@/components/editor-pro/example/media-value';
import { mentionValue } from '@/components/editor-pro/example/mention-value';
import { selectionValue } from '@/components/editor-pro/example/selection-value';
import { slashMenuValue } from '@/components/editor-pro/example/slash-menu-value';
import { tableValue } from '@/components/editor-pro/example/table-value';
import { uploadValue } from '@/components/editor-pro/example/upload-value';

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
