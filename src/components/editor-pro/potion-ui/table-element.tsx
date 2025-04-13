'use client';

import React from 'react';

import { cn } from '@udecode/cn';
import {
  TablePlugin,
  TableProvider,
  useTableElement,
} from '@udecode/plate-table/react';
import {
  PlateElement,
  useEditorPlugin,
  useReadOnly,
  withHOC,
} from '@udecode/plate/react';
import { PlusIcon } from 'lucide-react';

import { Button } from './button';

export const TableElement = withHOC(
  TableProvider,
  function TableElement({
    children,
    className,
    ...props
  }: React.ComponentProps<typeof PlateElement>) {
    const { editor, element } = props;
    const { tf } = useEditorPlugin(TablePlugin);
    const readOnly = useReadOnly();
    const {
      isSelectingCell,
      marginLeft,
      props: tableProps,
    } = useTableElement();

    return (
      <PlateElement
        className={cn(className, 'overflow-x-auto py-5')}
        style={{ paddingLeft: marginLeft }}
        {...props}
      >
        <div className="group/table relative w-fit">
          <table
            className={cn(
              'mr-0 ml-px table h-px table-fixed border-collapse',
              isSelectingCell && 'selection:bg-transparent'
            )}
            {...tableProps}
          >
            <tbody className="min-w-full">{children}</tbody>
          </table>

          {!readOnly && (
            <>
              <div
                className={cn(
                  'absolute inset-x-0 bottom-[-18px] flex flex-row opacity-0 transition-opacity hover:opacity-100',
                  'group-has-[tr:last-child:hover]/table:opacity-100 max-sm:group-has-[tr[data-selected]:last-child]/table:opacity-100'
                )}
              >
                <Button
                  size="none"
                  variant="ghost"
                  className={cn(
                    'flex h-4 w-full grow items-center justify-center bg-muted'
                  )}
                  onClick={() =>
                    tf.insert.tableRow({ at: editor.api.findPath(element) })
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  tooltip="Add a new row"
                  tooltipContentProps={{ side: 'bottom' }}
                >
                  <PlusIcon className="size-3.5! text-muted-foreground" />
                </Button>
              </div>

              <div
                className={cn(
                  'absolute inset-y-0 right-[-18px] flex opacity-0 transition-opacity hover:opacity-100',
                  'group-has-[td:last-child:hover,th:last-child:hover]/table:opacity-100 max-sm:group-has-[td[data-selected]:last-child,th[data-selected]:last-child]/table:opacity-100'
                )}
              >
                <Button
                  size="none"
                  variant="ghost"
                  className={cn(
                    'flex h-full w-4 grow items-center justify-center bg-muted'
                  )}
                  onClick={() =>
                    tf.insert.tableColumn({
                      at: editor.api.findPath(element),
                    })
                  }
                  onMouseDown={(e) => e.preventDefault()}
                  tooltip="Add a new column"
                  tooltipContentProps={{ side: 'bottom' }}
                >
                  <PlusIcon className="size-3.5! text-muted-foreground" />
                </Button>
              </div>

              <div
                className={cn(
                  'absolute right-[-18px] bottom-[-18px] flex flex-row opacity-0 transition-opacity hover:opacity-100',
                  'group-has-[td:last-child:hover,th:last-child:hover]/table:group-has-[tr:last-child:hover]/table:opacity-100 max-sm:group-has-[td[data-selected]:last-child,th[data-selected]:last-child]/table:group-has-[tr[data-selected]:last-child]/table:opacity-100'
                )}
              >
                <Button
                  size="none"
                  variant="ghost"
                  className={cn(
                    'flex size-4 items-center justify-center rounded-full bg-muted'
                  )}
                  onClick={() => {
                    editor.tf.withoutNormalizing(() => {
                      tf.insert.tableRow({ at: editor.api.findPath(element) });
                      tf.insert.tableColumn({
                        at: editor.api.findPath(element),
                      });
                    });
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  tooltip="Add a new row and column"
                  tooltipContentProps={{ side: 'bottom' }}
                >
                  <PlusIcon className="size-3.5! text-muted-foreground" />
                </Button>
              </div>
            </>
          )}
        </div>
      </PlateElement>
    );
  }
);
