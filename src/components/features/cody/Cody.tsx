"use client";

import {
  Chat,
  CodyAction,
  CodyState,
  GetHistoryResponse,
} from "@/src/interfaces/cody.interface";
import React from "react";
import { FaHistory } from "react-icons/fa";
import { FaMessage, FaXmark } from "react-icons/fa6";
import Logo from "../../global/Logo";
import History from "./read/History";

const reducer = (state: CodyState, action: CodyAction) => {
  switch (action.type) {
    case "set_interaction":
      return {
        ...state,
        interaction: action.data,
      };
    case "set_session":
      return {
        ...state,
        chatId: action.data,
      };
    case "new_session":
      return {
        interaction: null,
        chatId: 0,
        chats: [],
      };
    case "use_history":
      return {
        ...action.data,
      };
    case "push_chat":
      return {
        ...state,
        chats: [...state.chats, action.data],
      };
    case "update_chat":
      const index = state.chats.findIndex((c) => c.id === action.data.id);

      if (index === -1) return state;

      const update = [...state.chats];
      update[index] = { ...update[index], input: action.data.input };

      return {
        ...state,
        chats: update,
      };
    default:
      return state;
  }
};

const Cody = () => {
  const [canSeePanel, setCanSeePanel] = React.useState(false);
  const [state, dispatch] = React.useReducer(reducer, {
    interaction: null,
    chatId: 0,
    chats: [],
  });
  const [canSeeHistory, setCanSeeHistory] = React.useState(false);
  const inputRef = React.useRef<HTMLDivElement | null>(null);

  const handleCanSeePanel = () => {
    setCanSeePanel((prev) => !prev);
  };

  const streamResponse = async (
    reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>,
  ) => {
    const decoder = new TextDecoder("utf-8");

    let buffer = ""; // for token buffer
    let inputBuffer = ""; // for formatting the existing chat content with the token
    let rafId: number | null = null; // for animation request

    // chat id
    const id = Math.random();

    // rendering of token for state
    const flush = () => {
      rafId = null;
      dispatch({ type: "update_chat", data: { id, input: inputBuffer } });
      return;
    };

    // queue the flush using raf
    const scheduleFlush = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(flush);
      }
    };

    let dataLines: string[] = [];

    // initialize cody input
    const newChat = { input: "", sender: "cody", id } as Chat;

    dispatch({ type: "push_chat", data: newChat });

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      let event: "message" | "cody_completed" | "stored" = "message";

      for (const rawLine of lines) {
        const line = rawLine.replace(/\r$/, "");

        if (line.startsWith("event:")) {
          const value = (
            line.startsWith("event: ")
              ? line.slice("event: ".length)
              : line.slice("event:".length)
          ) as "message" | "cody_completed" | "stored";

          event = value;
        } else if (line.startsWith("data:")) {
          const value = line.startsWith("data: ")
            ? line.slice("data: ".length)
            : line.slice("data:".length);

          dataLines.push(value);
        } else if (line === "") {
          if (dataLines.length > 0) {
            const data = dataLines.join("\n");

            dataLines = [];

            switch (event) {
              case "stored":
                dispatch({ type: "set_session", data: Number(data) });
                break;
              case "cody_completed":
                dispatch({ type: "set_interaction", data: data });
                break;
              case "message":
                inputBuffer += data;
                scheduleFlush();
                break;
            }
          }

          continue;
        }
      }
    }

    // final cleanup of animation
    if (rafId) cancelAnimationFrame(rafId);
    flush();
  };

  const askCody = async () => {
    try {
      const el = inputRef.current;
      const chatId = state.chatId;

      if (!el) return;

      if (!chatId) return;

      const input = el.textContent;

      if (!input) return;

      el.innerHTML = "";

      const newChat = {
        input: input,
        sender: "user",
        id: Math.random(),
      } as Chat;

      dispatch({ type: "push_chat", data: newChat });

      const request = {
        input: input,
        interaction: state.interaction,
        id: chatId,
      };

      const response = await fetch(`/api/cody/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.body) {
        throw new Error(`Could not parse response.`);
      }

      // to read the stream from response
      const reader = response.body.getReader();

      await streamResponse(reader);
    } catch (error) {
      console.log(error);
    }
  };

  const initializeCody = async () => {
    try {
      const response = await fetch(`/api/cody`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.body) {
        throw new Error(`Could not parse response.`);
      }

      const reader = response.body.getReader();

      await streamResponse(reader);
    } catch (error) {
      console.log(error);
    }
  };

  const startChat = () => {
    dispatch({ type: "new_session" });
    handleCanSeePanel();
    initializeCody();
  };

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = inputRef.current;

    if (!el) return;

    if (el.textContent.trim() === "") {
      el.innerHTML = "";
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askCody();
    }
  };

  const handleCanSeeHistory = () => {
    setCanSeeHistory((prev) => !prev);
  };

  const getHistory = async (id: number) => {
    try {
      const response = await fetch(`/api/cody/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: GetHistoryResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { chats, interaction } = resolve.data;

      dispatch({
        type: "use_history",
        data: { chatId: id, interaction: interaction, chats: chats },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const mappedChats = state.chats.map((chat) => {
    return (
      <div
        key={chat.id}
        className={`w-full flex text-sm ${chat.sender === "cody" ? "justify-start" : "justify-end"}`}
      >
        <div
          className={`
            w-fit p-2 rounded-md max-w-10/12 t:max-w-8/12 l-s:max-w-10/12 whitespace-pre-line
            ${
              chat.sender === "cody"
                ? "bg-accent text-secondary"
                : "bg-neutral-300 text-primary justify-end items-end"
            }
          `}
        >
          {chat.input}
        </div>
      </div>
    );
  });

  return (
    <div
      className={`fixed flex flex-col items-start justify-start z-20 
                ${
                  canSeePanel
                    ? "w-full h-full top-0 right-0 l-s:max-w-(--breakpoint-m-l) shadow-md backdrop-blur-md bg-neutral-600/20"
                    : "right-5 bottom-5 drop-shadow-md"
                }`}
    >
      {canSeePanel ? (
        <div className="w-full h-full rounded-md flex flex-col items-start justify-start p-2 gap-2">
          <div className="w-full flex flex-row items-center justify-between bg-primary rounded-sm text-secondary p-2.5">
            <p>Ask Cody</p>

            <button
              onClick={handleCanSeePanel}
              className="p-2 rounded-full hover:bg-secondary/10"
            >
              <FaXmark />
            </button>
          </div>

          <div className="w-full flex flex-col items-start bg-secondary h-full rounded-md gap-4 overflow-hidden p-2">
            <div className="text-xs w-full flex justify-end relative">
              <button
                onClick={handleCanSeeHistory}
                className={`flex items-center justify-center gap-2 p-1 px-2 rounded-full ${canSeeHistory ? "text-secondary bg-primary" : "text-primary bg-secondary"}`}
              >
                <FaHistory /> <span>Chats</span>
              </button>

              {canSeeHistory && <History getHistory={getHistory} />}
            </div>

            <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto gap-4">
              {mappedChats}
            </div>
          </div>

          <div className="flex flex-row items-end w-full bg-secondary rounded-md gap-2 p-2 ">
            <div
              onKeyDown={(e) => handleInput(e)}
              id="cody-input"
              data-placeholder="Ask away"
              ref={inputRef}
              contentEditable={true}
              className="w-full flex flex-col items-start outline-none bg-neutral-200 p-2 min-h-10
                        border-none break-all max-h-32 overflow-y-auto t:max-h-40 rounded-sm text-primary"
            ></div>

            <button
              onClick={askCody}
              className="p-3 rounded-md text-secondary bg-accent"
            >
              <FaMessage />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startChat}
          className="rounded-full bg-primary max-w-10 w-10 p-2"
        >
          <Logo isTransparent type="light" />
        </button>
      )}
    </div>
  );
};

export default Cody;
