import React, { memo, useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useEditorPlugin } from '@udecode/plate/react';

import { ExtendedCommentsPlugin } from '@/components/editor-pro/components/editor/plugins/comments/ExtendedCommentsPlugin';
import { Comment as CommentItem } from '@/components/editor-pro/potion-ui/comment';
import { CommentCreateForm } from '@/components/editor-pro/potion-ui/comment-create-form';
import { Empty } from '@/components/ui/empty';
import { formatDiscussionDate } from '@/lib/date/formatDate';
import { useDiscussionsQueryOptions } from '@/trpc/hooks/query-options';

import { VersionsSkeleton } from './version-history/versions-skeleton';

export default memo(function DiscussionPanel() {
  const { api } = useEditorPlugin(ExtendedCommentsPlugin);
  const { data } = useQuery(useDiscussionsQueryOptions());

  const [editingId, setEditingId] = React.useState<string | null>(null);

  const isEmpty = useMemo(() => {
    if (!data?.discussions) return true;

    return (
      data?.discussions.filter(
        (discussion) =>
          !discussion.isResolved && api.comment.has({ id: discussion.id })
      ).length === 0
    );
  }, [api.comment, data?.discussions]);

  if (!data) return <VersionsSkeleton />;

  return (
    // <div className="mt-[44px]">
    <div>
      <div className="border-b px-4 py-3 text-sm font-semibold text-subtle-foreground">
        Comments
      </div>

      <div className="h-[calc(100vh_-_89px)] overflow-y-auto">
        {isEmpty ? (
          <Empty title="No open comments or suggestions" />
        ) : (
          data.discussions.map(
            (discussion) =>
              !discussion.isResolved &&
              api.comment.has({ id: discussion.id }) && (
                <div
                  key={discussion.id}
                  className="border-b p-4 hover:bg-accent/30"
                >
                  <div className="mb-3 text-xs font-medium text-muted-foreground">
                    {formatDiscussionDate(discussion.createdAt)}
                  </div>

                  {discussion?.comments?.map((comment, index) => (
                    <CommentItem
                      key={index}
                      comment={comment}
                      discussionLength={discussion.comments.length}
                      documentContent={discussion.documentContent}
                      editingId={editingId}
                      index={index}
                      setEditingId={setEditingId}
                      showDocumentContent
                    />
                  ))}
                  <CommentCreateForm discussionId={discussion.id} />
                </div>
              )
          )
        )}
      </div>
    </div>
  );
});
