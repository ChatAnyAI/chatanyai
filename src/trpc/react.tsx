'use client';

import React from 'react';


import { QueryClientProvider } from '@tanstack/react-query';
import { unstable_httpBatchStreamLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { SuperJSON } from 'superjson';
import { getQueryClient } from '@/trpc/query-client';

export const api = createTRPCReact();

export const useTRPC = () => {
  return api.useUtils();
};

export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  const [trpcClient] = React.useState(() =>
    api.createClient({
      links: [
        // loggerLink({
        //   enabled: (op) =>
        //     process.env.NODE_ENV === 'development' ||
        //     (op.direction === 'down' && op.result instanceof Error),
        // }),
        unstable_httpBatchStreamLink({
          transformer: SuperJSON,
          url: '/api',
          // headers() {
          //   const headers = new Headers();
          //   headers.set('x-trpc-source', 'nextjs-react');

          //   return headers;
          // },
        }),
      ],
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
