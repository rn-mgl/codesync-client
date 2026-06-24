"use client";
import React from "react";
import { FaMessage, FaXmark } from "react-icons/fa6";
import Logo from "../../global/Logo";

const Cody = () => {
  const [showPanel, setShowPanel] = React.useState(false);
  const messageRef = React.useRef<HTMLDivElement | null>(null);

  const handleShowPanel = () => {
    setShowPanel((prev) => !prev);
  };

  const onInput = () => {
    const el = messageRef.current;

    if (!el) return;

    if (el.textContent.trim() === "") {
      el.innerHTML = "";
    }
  };

  return (
    <div
      className={`fixed flex flex-col items-start justify-start z-30 
                ${
                  showPanel
                    ? "w-full h-full top-0 right-0 l-s:max-w-(--breakpoint-m-l) shadow-md backdrop-blur-md bg-neutral-600/20"
                    : "right-3 bottom-3 drop-shadow-md"
                }`}
    >
      {showPanel ? (
        <div className="w-full h-full rounded-md flex flex-col items-start justify-start animate-fade p-2 gap-2">
          <div className="w-full flex flex-row items-center justify-between bg-primary rounded-sm text-secondary p-2.5">
            <p>Ask Cody</p>

            <button
              onClick={handleShowPanel}
              className="p-2 rounded-full hover:bg-secondary/10"
            >
              <FaXmark />
            </button>
          </div>

          <div className="w-full flex flex-col items-start bg-secondary h-full rounded-md"></div>

          <div className="flex flex-row items-end w-full bg-secondary rounded-md gap-2 p-2 ">
            <div
              onInput={onInput}
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
          onClick={handleShowPanel}
          className="rounded-full bg-primary max-w-10 w-10 p-2 animate-fade"
        >
          <Logo isTransparent type="light" />
        </button>
      )}
    </div>
  );
};

export default Cody;
