'use client';

import { useChatStore } from '@/store/chatStore';
import { faker } from '@faker-js/faker';
import { useChat as useBaseChat } from '@/lib/ai-sdk/react';
import { useParams } from 'react-router-dom';
import {toast} from "@/hooks/use-toast";

export const useChat = () => {
  // const { keys, model } = useSettings();

  const { channelId: id, appId } = useParams();
  const modelId = useChatStore((state) => state.modelSelectedId);

  return useBaseChat({
    id: 'editor',
    api: `/api/app/${appId}/channel/${id}`,
    body: {
      id,
      modelId,
      options: {
        "frequency_penalty": 0.2,
        "max_tokens": 2048,
        "presence_penalty": 0.2,
        "temperature": 1
      },
      appId,
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: 'error',
        description: 'Failed to connect to the AI service',
        variant: "destructive",
      })
    },
    fetch: async (input, init) => {
      if (!init) return fetch(input);
      const { system, ...rest } = JSON.parse(init?.body as string);
      // [{
      // role: 'system',
      //   text: system,
      // }]
      rest.messages = [].concat(rest.messages);
      init.body = JSON.stringify(rest);
      const res = await fetch(input, init);

      if (!res.ok) {
        // Mock the API response. Remove it when you implement the route /api/ai/command
        await new Promise((resolve) => setTimeout(resolve, 400));

        const stream = fakeStreamText();

        return new Response(stream, {
          headers: {
            Connection: 'keep-alive',
            'Content-Type': 'text/plain',
          },
        });
      }

      return res;
    },
  });
};

// Used for testing. Remove it after implementing useChat api.
const fakeStreamText = ({
  chunkCount = 10,
  streamProtocol = 'data',
}: {
  chunkCount?: number;
  streamProtocol?: 'data' | 'text';
} = {}) => {
  const chunks = Array.from({ length: chunkCount }, () => ({
    delay: faker.number.int({ max: 150, min: 50 }),
    texts: faker.lorem.words({ max: 3, min: 1 }) + ' ',
  }));
  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, chunk.delay));

        if (streamProtocol === 'text') {
          controller.enqueue(encoder.encode(chunk.texts));
        } else {
          controller.enqueue(
            encoder.encode(`0:${JSON.stringify(chunk.texts)}\n`)
          );
        }
      }

      if (streamProtocol === 'data') {
        controller.enqueue(
          `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":${chunks.length}}}\n`
        );
      }

      controller.close();
    },
  });
};
