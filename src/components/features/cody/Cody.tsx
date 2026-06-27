"use client";

import React from "react";
import { FaMessage, FaXmark } from "react-icons/fa6";
import Logo from "../../global/Logo";

const Cody = () => {
  const [showPanel, setShowPanel] = React.useState(false);
  const [interaction, setInteraction] = React.useState<string | null>(null);
  const [chatId, setChatId] = React.useState(0);
  const [chats, setChats] = React.useState<
    { message: string; sender: "cody" | "user"; id: number }[]
  >([]);
  const messageRef = React.useRef<HTMLDivElement | null>(null);

  const handleShowPanel = () => {
    setShowPanel((prev) => !prev);
  };

  const askCody = async () => {
    try {
      const el = messageRef.current;

      if (!el) return;

      if (!chatId) return;

      const message = el.textContent;

      if (!message) return;

      // push user message
      setChats((prev) => [
        ...prev,
        { message: message, sender: "user", id: Math.random() },
      ]);

      const request = { message: message, interaction, id: chatId };

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
      const decoder = new TextDecoder("utf-8");

      let buffer = ""; // for token buffer
      let messageBuffer = ""; // for formatting the existing chat content with the token
      let rafId: number | null = null; // for animation request

      // chat id
      const id = Math.random();

      // rendering of token for state
      const flush = () => {
        setChats((prev) => {
          const idx = prev.findIndex((c) => c.id === id);

          if (idx === -1) {
            return prev;
          }

          const next = [...prev];
          next[idx] = { ...next[idx], message: messageBuffer };

          return next;
        });
        rafId = null;
      };

      // queue the flush using raf
      const scheduleFlush = () => {
        if (rafId === null) {
          rafId = requestAnimationFrame(flush);
        }
      };

      let dataLines: string[] = [];

      // initialize cody message
      setChats((prev) => [...prev, { message: "", sender: "cody", id }]);

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const rawLine of lines) {
          const line = rawLine.replace(/\r$/, "");

          if (line === "") {
            if (dataLines.length > 0) {
              const data = dataLines.join("\n");
              dataLines = [];

              if (data.startsWith("cody_completed=")) {
                const interactionId = data.replace("cody_completed=", "");
                setInteraction(interactionId);
              } else {
                messageBuffer += data;
                scheduleFlush();
              }
            }
          }

          if (line.startsWith("data:")) {
            const value = line.startsWith("data: ")
              ? line.slice("data: ".length)
              : line.slice("data:".length);
            dataLines.push(value);
          }
        }
      }

      // final cleanup of animation
      if (rafId) cancelAnimationFrame(rafId);
      flush();
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
      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let messageBuffer = "";
      let rafId: null | number = null;

      const id = Math.random();

      setChats((prev) => [...prev, { id, message: "", sender: "cody" }]);

      const flush = () => {
        setChats((prev) => {
          const index = prev.findIndex((c) => c.id === id);

          if (index === -1) return prev;

          const next = [...prev];
          next[index] = { ...next[index], message: messageBuffer };

          return next;
        });

        rafId = null;
      };

      const scheduleFlush = () => {
        if (!rafId) {
          rafId = requestAnimationFrame(flush);
        }
      };

      let dataLines: string[] = [];

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const rawLine of lines) {
          const line = rawLine.replace(/\r$/, "");

          if (line === "") {
            if (dataLines.length > 0) {
              const data = dataLines.join("\n");

              dataLines = [];

              console.log(data);

              if (data.startsWith("stored=")) {
                const id = data.slice("stored=".length);

                setChatId(Number(id));
              } else if (data.startsWith("cody_completed=")) {
                const interactionId = data.slice("cody_completed=".length);
                setInteraction(interactionId);
              } else {
                messageBuffer += data;
                scheduleFlush();
              }
            }
          }

          if (line.startsWith("data:")) {
            const value = line.startsWith("data: ")
              ? line.slice(6)
              : line.slice(5);
            dataLines.push(value);
          }
        }
      }

      if (rafId) cancelAnimationFrame(rafId);
      flush();
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = messageRef.current;

    if (!el) return;

    if (el.textContent.trim() === "") {
      el.innerHTML = "";
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askCody();
      el.innerHTML = "";
    }
  };

  const mappedChats = chats.map((chat) => {
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
          {chat.message}
        </div>
      </div>
    );
  });

  return (
    <div
      className={`fixed flex flex-col items-start justify-start z-30 
                ${
                  showPanel
                    ? "w-full h-full top-0 right-0 l-s:max-w-(--breakpoint-m-l) shadow-md backdrop-blur-md bg-neutral-600/20"
                    : "right-5 bottom-5 drop-shadow-md"
                }`}
    >
      {showPanel ? (
        <div className="w-full h-full rounded-md flex flex-col items-start justify-start p-2 gap-2">
          <div className="w-full flex flex-row items-center justify-between bg-primary rounded-sm text-secondary p-2.5">
            <p>Ask Cody</p>

            <button
              onClick={handleShowPanel}
              className="p-2 rounded-full hover:bg-secondary/10"
            >
              <FaXmark />
            </button>
          </div>

          <div className="w-full flex flex-col items-start bg-secondary h-full rounded-md gap-4 overflow-y-auto p-2">
            {mappedChats}
          </div>

          <div className="flex flex-row items-end w-full bg-secondary rounded-md gap-2 p-2 ">
            <div
              onKeyDown={(e) => handleInput(e)}
              id="cody-input"
              data-placeholder="Ask away"
              ref={messageRef}
              contentEditable={true}
              className="w-full flex flex-col items-start outline-none bg-neutral-200 p-2 min-h-10
                        border-none break-all max-h-32 overflow-y-auto t:max-h-40 rounded-sm text-primary"
            ></div>

            <button className="p-3 rounded-md text-secondary bg-accent">
              <FaMessage />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            handleShowPanel();
            initializeCody();
          }}
          className="rounded-full bg-primary max-w-10 w-10 p-2"
        >
          <Logo isTransparent type="light" />
        </button>
      )}
    </div>
  );
};

export default Cody;
