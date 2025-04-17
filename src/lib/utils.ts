import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type {
    // CoreToolMessage,
    Message,
    ToolInvocation,
} from '@/lib/ai-sdk/ui-utils';

import { RespChatHistoryMessage } from "@/service/api";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


interface ApplicationError extends Error {
    info: string;
    status: number;
}


export function getAnnotations(message: RespChatHistoryMessage) {
    // error msg
    try {
        const data = JSON.parse(message.content);
        if (data.type === 3) { 
            return [{
                type: 3,
                data: data.data,
            }];
        }
    } catch (error) {
    }

    if (message.ragContent && message.role === 'assistant') {
        return JSON.parse(message.ragContent);
    }

    if (message.role === 'user' && message.user) {
        return [{
            type: 2,
            data: {
                name: message.user.name,
                avatar: message.user.avatar,
            }

        }];
    }

    return [];
}

export function convertToUIMessages(messages: Array<RespChatHistoryMessage>): Array<Message> {
    return messages.reduce((chatMessages: Array<Message>, historyMessage) => {
        if (historyMessage.role === 'tool') {
            return addToolMessageToChat({
                // toolMessage: historyMessage as unknown as CoreToolMessage,
                toolMessage: historyMessage,
                messages: chatMessages,
            });
        }

        let textContent = '';
        const toolInvocations: Array<ToolInvocation> = [];

        if (typeof historyMessage.content === 'string') {
            textContent = historyMessage.content;
        } else if (Array.isArray(historyMessage.content)) {
            // @ts-ignore
            for (const content of historyMessage.content) {
                if (content.type === 'text') {
                    textContent += content.text;
                } else if (content.type === 'tool-call') {
                    toolInvocations.push({
                        state: 'call',
                        toolCallId: content.toolCallId,
                        toolName: content.toolName,
                        args: content.args,
                    });
                }
            }
        }

        chatMessages.push({
            id: historyMessage.id,
            role: historyMessage.role as Message['role'],
            content: textContent,
            toolInvocations,
            annotations: getAnnotations(historyMessage),
            user: historyMessage.user,
            employee: historyMessage.employee,
        });

        return chatMessages;
    }, []);
}


export function sanitizeUIMessages(messages: Array<Message>): Array<Message> {
    const messagesBySanitizedToolInvocations = messages.map((message) => {
        if (message.role !== 'assistant') return message;

        if (!message.toolInvocations) return message;

        const toolResultIds: Array<string> = [];

        for (const toolInvocation of message.toolInvocations) {
            if (toolInvocation.state === 'result') {
                toolResultIds.push(toolInvocation.toolCallId);
            }
        }

        const sanitizedToolInvocations = message.toolInvocations.filter(
            (toolInvocation) =>
                toolInvocation.state === 'result' ||
                toolResultIds.includes(toolInvocation.toolCallId),
        );

        return {
            ...message,
            toolInvocations: sanitizedToolInvocations,
        };
    });

    return messagesBySanitizedToolInvocations.filter(
        (message) =>
            message.content.length > 0 ||
            (message.toolInvocations && message.toolInvocations.length > 0),
    );
}


function addToolMessageToChat({
    toolMessage,
    messages,
}: {
    toolMessage: any;
    // toolMessage: CoreToolMessage;
    messages: Array<Message>;
}): Array<Message> {
    return messages.map((message) => {
        if (message.toolInvocations) {
            return {
                ...message,
                toolInvocations: message.toolInvocations.map((toolInvocation) => {
                    const toolResult = toolMessage.content.find(
                        (tool) => tool.toolCallId === toolInvocation.toolCallId,
                    );

                    if (toolResult) {
                        return {
                            ...toolInvocation,
                            state: 'result',
                            result: toolResult.result,
                        };
                    }

                    return toolInvocation;
                }),
            };
        }

        return message;
    });
}
export function loadScript(url: string) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = url

        script.onload = resolve
        script.onerror = reject

        document.head.appendChild(script)
    })
}


export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}


export function getFirstPathSegment(pathname: string): string {
    // Remove leading slash and split path by slashes
    const segments = pathname.replace(/^\//, '').split('/');
    // Return the first path segment, or empty string if none exists
    return segments[0] || '';
}