"use client";

import { useEffect, useRef, useState } from "react";

import { useUIState, useActions, useAIState } from "ai/rsc";
import { UserMessage } from "@/components/ui/message";

import { AI } from "./action";
import { ChatScrollAnchor } from "@/lib/hooks/chat-scroll-anchor";
import Textarea from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { ChatList } from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { addDocument } from "@/actions/addFile";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { MessageCirclePlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function Page() {
  const [messages, setMessages] = useUIState<typeof AI>();
  const [aiState, setAIState] = useAIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  const [inputValue, setInputValue] = useState("");
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [showDebug, setShowDebug] = useState<"indeterminate" | boolean>(
    "indeterminate"
  );
  const [openFileModal, setOpenFileModal] = useState(false);
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { formRef: addFileForm } = useEnterSubmit();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        if (
          e.target &&
          ["INPUT", "TEXTAREA"].includes((e.target as any).nodeName)
        ) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (inputRef?.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  return (
    <div>
      <div className="pb-[200px] pt-4 md:pt-10">
        {messages.length ? (
          <>
            <ChatList messages={messages} />
          </>
        ) : (
          <EmptyScreen
            submitMessage={async (message) => {
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <UserMessage>{message}</UserMessage>,
                },
              ]);

              // Submit and get response message
              const responseMessage = await submitUserMessage(message);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);
            }}
          />
        )}
        <ChatScrollAnchor trackVisibility={true} />
      </div>
      <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
        <div className="mx-auto sm:max-w-2xl sm:px-4">
          <Dialog open={openFileModal} onOpenChange={setOpenFileModal}>
            <DialogContent>
              <form
                className="p-4 space-y-4"
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const file = inputFiles[0];
                  if (!file) {
                    console.log("No file selected");
                    return;
                  }
                  try {
                    const formData = new FormData();
                    formData.append("file", file);
                    const response = await addDocument(formData);

                    if (response.status === "error") {
                      console.error(response.error);
                      toast.error(response.error);
                      setOpenFileModal(false);
                      return;
                    }
                    toast.success("File added successfully");
                    setOpenFileModal(false);
                  } catch (e) {
                    console.error(e);
                  }
                }}
                ref={addFileForm}
              >
                <Input
                  dropZone
                  accept=".pdf,.docx,.csv,.txt"
                  className="min-h-32 border-dashed"
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setInputFiles([e.target.files[0]]);
                    }
                  }}
                />

                <Button type="submit" disabled={inputFiles.length < 1}>
                  <span>Add File</span>
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          {showDebug === true ? (
            <div className="">
              <div className="max-w-xs">
                {aiState?.[aiState.length - 1].content}
              </div>
            </div>
          ) : null}
          <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-background sm:rounded-t-xl sm:border md:py-4">
            <div className="w-full items-center flex justify-end">
              <label className="flex items-center space-x-2">
                <span>Show Debug</span>
                <Checkbox onCheckedChange={setShowDebug} />
              </label>
            </div>
            <form
              ref={formRef}
              onSubmit={async (e: any) => {
                e.preventDefault();

                // Blur focus on mobile
                if (window.innerWidth < 600) {
                  e.target["message"]?.blur();
                }

                const value = inputValue.trim();
                setInputValue("");
                if (!value) return;

                // Add user message UI
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: Date.now(),
                    display: <UserMessage>{value}</UserMessage>,
                  },
                ]);

                try {
                  // Submit and get response message
                  const responseMessage = await submitUserMessage(value);
                  setMessages((currentMessages) => [
                    ...currentMessages,
                    responseMessage,
                  ]);
                } catch (error) {
                  // You may want to show a toast or trigger an error state.
                  console.error(error);
                }
              }}
            >
              <div className="relative flex flex-col w-full px-8 overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 w-8 h-8 p-0 rounded-full top-4 bg-background sm:left-4"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenFileModal(!openFileModal);
                      }}
                    >
                      <IconPlus />
                      <span className="sr-only">
                        Add File <MessageCirclePlus />
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add File</TooltipContent>
                </Tooltip>
                <Textarea
                  ref={inputRef}
                  tabIndex={0}
                  onKeyDown={onKeyDown}
                  placeholder="Send a message."
                  className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm border-none accent-transparent ring-0"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                  name="message"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <div className="absolute right-0 top-4 sm:right-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="submit"
                        size="icon"
                        disabled={inputValue === ""}
                      >
                        <IconArrowElbow />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send message</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
