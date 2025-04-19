import type {
  Attachment,
  ChatRequestOptions,
  CreateMessage,
  Message,
} from '@/lib/ai-sdk/ui-utils';
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
import useSWR from "swr";
import { ApiEmployeeItemResp, ApiEmployeeList, Assistant, Employee } from '@/service/api';

// Define the mention type
type Mention = {
    name: string
    start: number
    end: number
} | null

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
                               setAssistant,
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
  setAssistant: (value: Assistant) => void;
}) {
  const autoFocus = true
  const placeholder = "Type a message here... (Use @ to mention your AI team members)"
  const [isEmpty, setIsEmpty] = useState(true)
  const textareaRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const [showMentions, setShowMentions] = useState(false)
  const mentionRef = useRef<HTMLDivElement>(null)
  const [currentAtPos, setCurrentAtPos] = useState(-1)
  // Add state for cursor position
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  // const [message, setMessage] = useState("")
  const [mention, setMention] = useState<Mention>(null)
  // Add a new state to track the currently selected index in the mention list
  const [selectedIndex, setSelectedIndex] = useState(0)

  const overlayRef = useRef<HTMLDivElement>(null)
// Team members data
//     const teamMembers = [
//         { id: 1, name: "Mike", role: "Team Leader", avatar: "/avatars/mike.png", color: "bg-orange-200" },
//         { id: 2, name: "Emma", role: "Product Manager", avatar: "/avatars/emma.png", color: "bg-pink-200" },
//         { id: 3, name: "Bob", role: "Architect", avatar: "/avatars/bob.png", color: "bg-gray-200" },
//         { id: 4, name: "Alex", role: "Engineer", avatar: "/avatars/alex.png", color: "bg-blue-200" },
//         { id: 5, name: "David", role: "Data Analyst", avatar: "/avatars/david.png", color: "bg-green-200" },
//     ]
    const { data: employeeList, error,mutate } = useSWR<ApiEmployeeItemResp[]>('ApiEmployeeList', ApiEmployeeList);


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
      const domValue = textareaRef.current.textContent || '';
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || '';
      setInput(finalValue);
      adjustHeight();
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // Add a useEffect to initialize the input field with the initial content
    useEffect(() => {
        if (autoFocus) {
            setTimeout(focusInputAtEnd, 0)
        }
    }, [autoFocus])

    // Function to focus the input and place cursor at the end
    const focusInputAtEnd = () => {
        if (!textareaRef.current) return

        // Focus the element
        textareaRef.current.focus()

        // Place cursor at the end
        const selection = window.getSelection()
        const range = document.createRange()

        // If the input is empty, just collapse at the beginning
        if (!textareaRef.current.childNodes.length) {
            range.setStart(textareaRef.current, 0)
            range.collapse(true)
        } else {
            // Otherwise, place cursor at the end of the content
            const lastChild = textareaRef.current.childNodes[textareaRef.current.childNodes.length - 1]
            if (lastChild.nodeType === Node.TEXT_NODE) {
                range.setStart(lastChild, lastChild.textContent?.length || 0)
            } else {
                range.setStartAfter(lastChild)
            }
            range.collapse(true)
        }

        selection?.removeAllRanges()
        selection?.addRange(range)
    }

  useEffect(() => {
    setLocalStorageInput(input);
  }, [input, setLocalStorageInput]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const content = e.currentTarget.textContent || ""
      setIsEmpty(content === "")
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

    // Get cursor position in plain text
    const getCursorPosition = (): number => {
        if (!textareaRef.current) return 0

        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) return 0

        const range = document.createRange()
        range.setStart(textareaRef.current, 0)
        range.setEnd(selection.anchorNode!, selection.anchorOffset)

        return range.toString().length
    }

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

    // Add function to check if textarea contains a mention span
    const hasMentionSpan = (): boolean => {
        if (!textareaRef.current) return false
        // Check if there's any span with bg-blue-500 class (mention highlight)
        return !!textareaRef.current.querySelector('span.bg-blue-500')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (showMentions) {
            if (!employeeList) return
            // Prevent default behavior for navigation keys
            if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Tab" || e.key === "Enter") {
                e.preventDefault()
            }

            switch (e.key) {
                case "ArrowUp":
                    // Move selection up
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : employeeList.length - 1))
                    break
                case "ArrowDown":
                    // Move selection down
                    setSelectedIndex((prev) => (prev < employeeList.length - 1 ? prev + 1 : 0))
                    break
                case "Tab":
                case "Enter":
                    // Select the currently highlighted member
                    if (employeeList[selectedIndex]) {
                        handleSelectMember({
                            id: employeeList[selectedIndex].id,
                            name: employeeList[selectedIndex].name,
                            avatar: employeeList[selectedIndex].avatar,
                        })
                    }
                    break
                case "Escape":
                    // Close the mention list
                    setShowMentions(false)
                    break
            }
        } else if (e.key === "Backspace" || e.key === "Delete") {
            // // Handle deletion of mentions
            // const { mentionIndex, position } = findMentionAtCursor()
            //
            // if (mentionIndex !== -1) {
            //     // If Backspace is pressed and cursor is after the mention, or
            //     // if Delete is pressed and cursor is before the mention
            //     if ((e.key === "Backspace" && position === "after") || (e.key === "Delete" && position === "before")) {
            //         e.preventDefault()
            //         deleteMention(mentionIndex)
            //     }
            // }
        } else {
            // const content = e.currentTarget.textContent || ""
            // setMessage(content)
            // show mentions employee list
          if (e.key === '@' && !hasMentionSpan()) {
                // Get current cursor position coordinates
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    
                    // Create a temporary span element to get accurate coordinates
                    const tempSpan = document.createElement('span');
                    tempSpan.textContent = '|'; // Invisible marker
                    
                    // Insert at cursor position temporarily
                    range.insertNode(tempSpan);
                    
                    // Get the position of the span
                    const rect = tempSpan.getBoundingClientRect();
                    setCursorPosition({ 
                        x: rect.left, 
                        y: rect.top 
                    });
                    
                    // Save current text position for mention insertion
                    setCurrentAtPos(getCursorPosition());
                    
                    // Clean up - remove the temporary span
                    tempSpan.parentNode?.removeChild(tempSpan);
                    
                    // Show the mentions dropdown
                    setShowMentions(true);
                }
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

        // Handle member selection - completely rewritten to fix the bug
    const handleSelectMember = (employee: Assistant) => {
        setShowMentions(false)
        if (!textareaRef.current || currentAtPos === -1) return
        // Get the plain text content
        const plainText = textareaRef.current.textContent || ""
        // Create the new mention
        const newMention = {
            name: employee.name,
            start: currentAtPos,
            end: currentAtPos + employee.name.length + 1, // +1 for the @ symbol
        }

        // Create new content by replacing the @ with @name
        const beforeAt = plainText.substring(0, currentAtPos)
        const afterAt = plainText.substring(currentAtPos + 1) // Skip the @ symbol
        const newContent = beforeAt + "@" + employee.name + " " + afterAt

        // Update the mentions array with adjusted positions for existing mentions
        // that come after the new mention
        // const updatedMentions = mentions.map((mention) => {
        //     if (mention.start > currentAtPos) {
        //         // Adjust positions for mentions that come after the new one
        //         const offset = name.length + 1 // +1 for the space after the name
        //         return {
        //             ...mention,
        //             start: mention.start + offset,
        //             end: mention.end + offset,
        //         }
        //     }
        //     return mention
        // })

        // Add the new mention
        // const newMentions = [...updatedMentions, newMention]

        // Update state
        setMention(newMention)
        // setMessage(newContent)
        setIsEmpty(false)
        setAssistant(employee)

        // Update the input content and apply highlighting
        if (textareaRef.current) {
            textareaRef.current.textContent = newContent
            highlightMentions(newContent, newMention)
        }

        // Reset current @ position
        setCurrentAtPos(-1)
    }

    // Completely rewritten highlight mentions function
    const highlightMentions = (content = "", newMention = mention) => {
        if (!textareaRef.current) return
        if (!newMention) return;
        // Save current selection
        const selection = window.getSelection()
        const savedSelection = {
            node: selection?.anchorNode,
            offset: selection?.anchorOffset || 0,
        }

        // Clear the input
        textareaRef.current.innerHTML = ""

        // If no content provided, use the current message
        const textContent = content

        // Sort mentions by start position
        // const sortedMentions = [...mentionsToHighlight].sort((a, b) => a.start - b.start)

        let lastIndex = 0

        // Process each mention
        // for (const mention of sortedMentions) {
            // Add text before the mention
            if (newMention.start > lastIndex) {
                const textBefore = document.createTextNode(textContent.substring(lastIndex, newMention.start))
                textareaRef.current.appendChild(textBefore)
            }

            // Add the highlighted mention
            const mentionText = "@" + newMention.name
            const mentionSpan = document.createElement("span")
            mentionSpan.textContent = mentionText
            mentionSpan.className = "bg-blue-500 text-white rounded px-1"
            textareaRef.current.appendChild(mentionSpan)

            // Update the last index to after the mention
            lastIndex = newMention.start + mentionText.length
        // }

        // Add any remaining text
        if (lastIndex < textContent.length) {
            const textAfter = document.createTextNode(textContent.substring(lastIndex))
            textareaRef.current.appendChild(textAfter)
        }

        // Try to restore cursor position
        if (savedSelection.node) {
            try {
                // Place cursor at the end as a fallback
                const range = document.createRange()
                range.selectNodeContents(textareaRef.current)
                range.collapse(false)
                selection?.removeAllRanges()
                selection?.addRange(range)
            } catch (e) {
                console.error("Failed to restore selection", e)
            }
        }
    }

    // Handle focus to clear placeholder
    const handleFocus = () => {
        if (isEmpty && textareaRef.current) {
            // Make sure we don't accidentally select the placeholder text
            const selection = window.getSelection()
            const range = document.createRange()
            range.selectNodeContents(textareaRef.current)
            range.collapse(true)
            selection?.removeAllRanges()
            selection?.addRange(range)
        }
    }
    return (
      <div className="relative w-full flex flex-col ">
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
          {isEmpty && <div className="absolute top-2 left-4 text-gray-400 pointer-events-none">{placeholder}</div>}
          <div
              ref={textareaRef}
              contentEditable
              onInput={handleInput}
              className={"min-h-[144px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl text-base! bg-muted pb-10 dark:border-zinc-700 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"}
              style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
              autoFocus
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
          />

          {/* Only show mentions when no existing mention span, showMentions is true, and employeeList exists */}
          {showMentions && employeeList && !hasMentionSpan() && (
              <div
                  ref={mentionRef}
                  className="fixed"
                  style={{
                      zIndex: 50,
                      left: `${cursorPosition.x}px`,
                      bottom: `calc(100vh - ${cursorPosition.y}px + 5px)`, // Position above cursor with small offset
                  }}
              >
                  <MentionList members={employeeList} onSelectMember={handleSelectMember} selectedIndex={selectedIndex}  />
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
        // todo
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
