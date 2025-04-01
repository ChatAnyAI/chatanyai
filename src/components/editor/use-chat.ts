'use client';

import { toast } from '@/hooks/use-toast';
import { faker } from '@faker-js/faker';
import { useChat as useBaseChat } from 'ai/react';

// import { useSettings } from '@/components/editor/settings';
import { useParams } from 'react-router-dom';

export const useChat = () => {
  // const { keys, model } = useSettings();

  const { chatId: id, appId } = useParams();

  return useBaseChat({
    id: 'editor',
    api: `/api/app/${appId}/channel/${id}`,
    body: {
      id,
      modelId: 'openai-gpt-4o-mini',
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
      rest.messages = [{
        role: 'system',
        text: system,
      }].concat(rest.messages);
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
  // Create 3 blocks with different lengths
  const blocks = [
    Array.from({ length: chunkCount }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + ' ',
    })),
    Array.from({ length: chunkCount + 2 }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + ' ',
    })),
    Array.from({ length: chunkCount + 4 }, () => ({
      delay: faker.number.int({ max: 100, min: 30 }),
      texts: faker.lorem.words({ max: 3, min: 1 }) + ' ',
    })),
  ];

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];

        // Stream the block content
        for (const chunk of block) {
          await new Promise((resolve) => setTimeout(resolve, chunk.delay));

          if (streamProtocol === 'text') {
            controller.enqueue(encoder.encode(chunk.texts));
          } else {
            controller.enqueue(
              encoder.encode(`0:${JSON.stringify(chunk.texts)}\n`)
            );
          }
        }

        // Add double newline after each block except the last one
        if (i < blocks.length - 1) {
          if (streamProtocol === 'text') {
            controller.enqueue(encoder.encode('\n\n'));
          } else {
            controller.enqueue(encoder.encode(`0:${JSON.stringify('\n\n')}\n`));
          }
        }
      }

      if (streamProtocol === 'data') {
        controller.enqueue(
          `d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":${blocks.reduce(
            (sum, block) => sum + block.length,
            0
          )}}}\n`
        );
      }

      controller.close();
    },
  });
};
