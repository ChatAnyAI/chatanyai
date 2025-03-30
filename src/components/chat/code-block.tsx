'use client';

import { useState } from 'react';
import Mermaid from './mermaid/mermaid';

interface CodeBlockProps {
  inline: boolean;
  className?: string;
  children: any;
}

export function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [output] = useState<string | null>(null);
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1] ?? 'text'
  const [tab] = useState<'code' | 'run'>('code');

    console.log("language",language)
    console.log("languagechildren",children)

if (language === 'mermaid' || language === 'flowchart') {
    return <Mermaid chart={children} />
}

    // if (language === 'plantuml' && isValidPlantUML(children)) {
    //     return <PlantUML diagram={children} />
    // }

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        {tab === 'code' && (
          <pre
            {...props}
            className={`text-sm w-full overflow-x-auto dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl dark:text-zinc-50 text-zinc-900`}
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        )}

        {tab === 'run' && output && (
          <div className="text-sm w-full overflow-x-auto bg-zinc-800 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 border-t-0 rounded-b-xl text-zinc-50">
            <code>{output}</code>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <code
        className={`${className} text-sm bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 py-0.5 px-1.5 rounded-md border border-zinc-200 dark:border-zinc-700`}
        {...props}
      >
        {children}
      </code>
    );
  }
}
