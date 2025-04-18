import { cache } from 'react';

import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { createQueryClient } from '@/trpc/query-client';
import { AppRouter } from '@/server/api/root'; // Adjust this import path as needed

/**
 * This wraps the `createTRPCContext` helper and provides the required context
 * for the tRPC API when handling a tRPC call from a React Server Component.
 */
// const createContext = cache(async () => {
//   const heads = new Headers(await headers());
//   heads.set('x-trpc-source', 'rsc');

//   return createTRPCContext({
//     cookies:
//       process.env.NODE_ENV === 'production'
//         ? undefined
//         : (await cookies()).getAll(),
//     headers: heads,
//     session,
//     user,
//   });
// });

const getQueryClient = cache(createQueryClient);
// const caller = createCaller(createContext);
export const { HydrateClient, trpc } = createHydrationHelpers<AppRouter>(
  cache(() => {
    return {
      queryClient: getQueryClient(),
      // caller: createCaller(createContext),
    };
  }),
  // caller: () => console.log('caller'),
  getQueryClient
);
