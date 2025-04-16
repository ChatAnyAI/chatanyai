import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from 'ai';
import cx from 'classnames';
import type React from 'react';
import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
  memo,
} from 'react';
import { toast } from 'sonner';
import { useLocalStorage, useWindowSize } from 'usehooks-ts';

import {cn, sanitizeUIMessages} from '@/lib/utils';

import { ArrowUpIcon, PaperclipIcon, StopIcon } from './icons';
import { PreviewAttachment } from './preview-attachment';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SuggestedActions } from './suggested-actions';
import equal from 'fast-deep-equal';
import { useNavigate, useParams } from 'react-router-dom';
import { ModelSelector } from './model-selector';
import {Settings2} from "lucide-react";
import { useRightSetting } from '@/app/front/aichat/component/rightSetting';
import MentionList from "@/components/chat/mention-list";

function PureMultimodalInput({
  channelId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
  className,
}: {
  channelId: string;
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  stop: () => void;
  attachments: Array<Attachment>;
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>;
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  handleSubmit: (
    event?: {
      preventDefault?: () => void;
    },
    chatRequestOptions?: ChatRequestOptions,
  ) => void;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { width } = useWindowSize();
  const [showMentions, setShowMentions] = useState(false)
  const mentionRef = useRef<HTMLDivElement>(null)
  const [mentions, setMentions] = useState<{ name: string; start: number; end: number }[]>([])
  const [currentAtPos, setCurrentAtPos] = useState(-1)
  const [message, setMessage] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const overlayRef = useRef<HTMLDivElement>(null)
// Team members data
    const teamMembers = [
        { id: 1, name: "Mike", role: "Team Leader", avatar: "/avatars/mike.png", color: "bg-orange-200" },
        { id: 2, name: "Emma", role: "Product Manager", avatar: "/avatars/emma.png", color: "bg-pink-200" },
        { id: 3, name: "Bob", role: "Architect", avatar: "/avatars/bob.png", color: "bg-gray-200" },
        { id: 4, name: "Alex", role: "Engineer", avatar: "/avatars/alex.png", color: "bg-blue-200" },
        { id: 5, name: "David", role: "Data Analyst", avatar: "/avatars/david.png", color: "bg-green-200" },
    ]
  // Add a new state to track the currently selected index in the mention list
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = '98px';
    }
  };

    // Close mention list when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                mentionRef.current &&
                !mentionRef.current.contains(event.target as Node) &&
                textareaRef.current &&
                !textareaRef.current.contains(event.target as Node)
            ) {
                setShowMentions(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

  const [localStorageInput, setLocalStorageInput] = useLocalStorage(
    'input',
    '',
  );

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value;
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const content = e.currentTarget.textContent || ""

    console.log("handleInput",content)
    setInput(content);
    adjustHeight();

      // const content = event.target.value
      // setMessage(content)
      // setCursorPosition(event.target.selectionStart || 0)
      //
      // // Check if @ was just typed
      // const atIndex = findLastUnprocessedAtSymbol(content)
      // if (atIndex !== -1) {
      //     setShowMentions(true)
      //     setCurrentAtPos(atIndex)
      // } else {
      //     setShowMentions(false)
      // }
      //
      // // Update the overlay to show highlighted mentions
      // updateOverlay()
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([]);
  const navigate = useNavigate();
  const param = useParams();
  const { showSettings, setShowSettings } = useRightSetting();

  const submitForm = useCallback(() => {
    if (channelId !== param.channelId) {
      navigate(`c/${channelId}`, { replace: true });
    }


    handleSubmit(undefined, {
      experimental_attachments: attachments,
    });

    setAttachments([]);
    setLocalStorageInput('');
    resetHeight();

    if (width && width > 768) {
      textareaRef.current?.focus();
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    channelId,
  ]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const { url, pathname, contentType } = data;

        return {
          url,
          name: pathname,
          contentType: contentType,
        };
      }
      const { error } = await response.json();
      toast.error(error);
    } catch (error) {
      toast.error('Failed to upload file, please try again!');
    }
  };

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);

      setUploadQueue(files.map((file) => file.name));

      try {
        const uploadPromises = files.map((file) => uploadFile(file));
        const uploadedAttachments = await Promise.all(uploadPromises);
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined,
        );

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ]);
      } catch (error) {
        console.error('Error uploading files!', error);
      } finally {
        setUploadQueue([]);
      }
    },
    [setAttachments],
  );


    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions) {
            // Prevent default behavior for navigation keys
            if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab" || e.key === "Enter") {
                e.preventDefault()
            }

            switch (e.key) {
                case "ArrowUp":
                    // Move selection up
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : teamMembers.length - 1))
                    break
                case "ArrowDown":
                    // Move selection down
                    setSelectedIndex((prev) => (prev < teamMembers.length - 1 ? prev + 1 : 0))
                    break
                case "Tab":
                case "Enter":
                    // Select the currently highlighted member
                    if (teamMembers[selectedIndex]) {
                        handleSelectMember(teamMembers[selectedIndex].name)
                    }
                    break
                case "Escape":
                    // Close the mention list
                    setShowMentions(false)
                    break
            }
        }else {
            const content = e.currentTarget.textContent || ""
            setMessage(content)
            // show mentions employee list
            if ( e.key === '@') {
                const cursorPosition = textareaRef.current?.selectionStart || 0;
                console.log(`The '@' character is at position: ${cursorPosition}`);
                setCurrentAtPos(cursorPosition); // 保存当前位置
                setShowMentions(true);
            }

            // Only process Enter key when not in IME composition
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                if (isLoading) {
                    toast.error('Please wait for the model to finish its response!');
                } else {
                    submitForm();
                    setInput("")
                    if (textareaRef.current) {
                        textareaRef.current.textContent = ""
                    }
                }
            }
        }
    }


    // Handle member selection
    const handleSelectMember = (name: string) => {
        setShowMentions(false)

        if (!textareaRef.current || currentAtPos === -1) return

        // Create the new mention
        const newMention = {
            name,
            start: currentAtPos,
            end: currentAtPos + name.length + 1, // +1 for the @ symbol
        }

        // Create new content by replacing the @ with @name
        const beforeAt = message.substring(0, currentAtPos)
        const afterAt = message.substring(currentAtPos + 1) // Skip the @ symbol
        const newContent = beforeAt + "@" + name + " " + afterAt

        // Update the mentions array with adjusted positions for existing mentions
        // that come after the new mention
        const updatedMentions = mentions.map((mention) => {
            if (mention.start > currentAtPos) {
                // Adjust positions for mentions that come after the new one
                const offset = name.length + 1 // +1 for the space after the name
                return {
                    ...mention,
                    start: mention.start + offset,
                    end: mention.end + offset,
                }
            }
            return mention
        })

        // Add the new mention
        const newMentions = [...updatedMentions, newMention]

        // Update state
        setMentions(newMentions)
        setMessage(newContent)

        // Update the textarea value
        if (textareaRef.current) {
            textareaRef.current.value = newContent

            // Set cursor position after the mention
            const newCursorPos = currentAtPos + name.length + 2 // +2 for @ and space
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
            textareaRef.current.focus()
            setCursorPosition(newCursorPos)
        }

        // Reset current @ position
        setCurrentAtPos(-1)

        // Update the overlay
        setTimeout(updateOverlay, 0)
    }
    // Find the last @ symbol that isn't part of an existing mention
    const findLastUnprocessedAtSymbol = (content: string): number => {
        const lastAtIndex = content.lastIndexOf("@")
        if (lastAtIndex === -1) return -1

        // Check if this @ is part of an existing mention
        for (const mention of mentions) {
            if (lastAtIndex >= mention.start && lastAtIndex < mention.end) {
                return -1 // This @ is part of an existing mention
            }
        }

        // Check if the @ is preceded by a space or is at the start of the text
        if (lastAtIndex === 0 || content[lastAtIndex - 1] === " ") {
            return lastAtIndex
        }

        return -1
    }


    // Update the overlay to show highlighted mentions
    const updateOverlay = () => {
        if (!overlayRef.current || !textareaRef.current) return

        // Create HTML content for the overlay
        let html = ""
        let lastIndex = 0

        // Sort mentions by start position
        const sortedMentions = [...mentions].sort((a, b) => a.start - b.start)

        // Process each mention
        for (const mention of sortedMentions) {
            // Add text before the mention
            if (mention.start > lastIndex) {
                const textBefore = message.substring(lastIndex, mention.start)
                html += textBefore.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")
            }

            // Add the highlighted mention
            const mentionText = message.substring(mention.start, mention.end)
            html += `<span class="bg-blue-500 text-white rounded px-1">${mentionText}</span>`

            // Update the last index
            lastIndex = mention.end
        }

        // Add any remaining text
        if (lastIndex < message.length) {
            const textAfter = message.substring(lastIndex)
            html += textAfter.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")
        }

        // Set the HTML content of the overlay
        overlayRef.current.innerHTML = html || "&nbsp;" // Use non-breaking space if empty

        // Match the overlay's scroll position to the textarea
        overlayRef.current.scrollTop = textareaRef.current.scrollTop
    }

    // Reset selectedIndex when showing/hiding mentions
    // Add this effect after the other useEffect hooks
    useEffect(() => {
        if (showMentions) {
            setSelectedIndex(0)
        }
    }, [showMentions])


    return (
      <div className="relative w-full flex flex-col gap-4">
          {messages.length === 0 &&
              attachments.length === 0 &&
              uploadQueue.length === 0 && (
                  <SuggestedActions append={append} channelId={channelId}/>
              )}

          <input
              type="file"
              className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
              ref={fileInputRef}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              tabIndex={-1}
          />

          {(attachments.length > 0 || uploadQueue.length > 0) && (
              <div className="flex flex-row gap-2 overflow-x-scroll items-end">
                  {attachments.map((attachment) => (
                      <PreviewAttachment key={attachment.url} attachment={attachment}/>
                  ))}

                  {uploadQueue.map((filename) => (
                      <PreviewAttachment
                          key={filename}
                          attachment={{
                              url: '',
                              name: filename,
                              contentType: '',
                          }}
                          isUploading={true}
                      />
                  ))}
              </div>
          )}
          {/* Overlay for highlighted mentions */}
          <div
              ref={overlayRef}
              className="absolute inset-0 text-transparent pointer-events-none p-2 whitespace-pre-wrap font-sans text-base overflow-hidden"
              style={{ fontFamily: "inherit" }}
          ></div>

          <div
              ref={textareaRef}
              contentEditable
              placeholder="Send a message..."
              value={input}
              onInput={handleInput}
              className={cx(
                  'min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl text-base! bg-muted pb-10 dark:border-zinc-700',
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              )}
              rows={3}
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              autoFocus
              onKeyDown={handleKeyDown}
          />

          {showMentions && (
              <div
                  ref={mentionRef}
                  className={"absolute bottom-34"}
                  style={{
                      // position: "fixed", // Change to fixed positioning
                      // top: `${mentionPosition.top}px`,
                      // left: `${mentionPosition.left}px`,
                      // top: `10px`,
                      zIndex: 50,
                  }}
              >
                  <MentionList members={teamMembers} onSelectMember={handleSelectMember} selectedIndex={selectedIndex}  />
              </div>
          )}

          <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start gap-0.5">
              {/* <AttachmentsButton fileInputRef={fileInputRef} isLoading={isLoading} /> */}
              <ModelSelector />
                <Button
                  className={'w-fit cursor-pointer bg-transparent'}
                  variant="outline"
                  size="sm"
                  onClick={(e) => { 
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSettings(!showSettings)
                  }}
                >
                  <Settings2 />
                </Button>
          </div>
          <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
              {isLoading ? (
                  <StopButton stop={stop} setMessages={setMessages}/>
              ) : (
                  <SendButton
                      input={input}
                      submitForm={submitForm}
                      uploadQueue={uploadQueue}
                  />
              )}
          </div>
      </div>
  );
}

export const MultimodalInput = memo(
    PureMultimodalInput,
    (prevProps, nextProps) => {
        if (prevProps.input !== nextProps.input) return false;
        if (prevProps.isLoading !== nextProps.isLoading) return false;
    if (!equal(prevProps.attachments, nextProps.attachments)) return false;

    return true;
  },
);

function PureAttachmentsButton({
  fileInputRef,
  isLoading,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>;
  isLoading: boolean;
}) {
  return (
    <Button
      className="rounded-md rounded-bl-lg p-[7px] h-fit dark:border-zinc-700 dark:hover:bg-zinc-900 hover:bg-zinc-200"
      onClick={(event) => {
        event.preventDefault();
        fileInputRef.current?.click();
      }}
      disabled={isLoading}
      variant="ghost"
    >
      <PaperclipIcon size={14} />
    </Button>
  );
}

const AttachmentsButton = memo(PureAttachmentsButton);

function PureStopButton({
  stop,
  setMessages,
}: {
  stop: () => void;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}) {
  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        stop();
        setMessages((messages) => sanitizeUIMessages(messages));
      }}
    >
      <StopIcon size={14} />
    </Button>
  );
}

const StopButton = memo(PureStopButton);

function PureSendButton({
  submitForm,
  input,
  uploadQueue,
}: {
  submitForm: () => void;
  input: string;
  uploadQueue: Array<string>;
}) {

  console.log("input",input)


  return (
    <Button
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault();
        submitForm();
      }}
      disabled={input.length === 0 || uploadQueue.length > 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  );
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.uploadQueue.length !== nextProps.uploadQueue.length)
    return false;
  if (prevProps.input !== nextProps.input) return false;
  return true;
});
