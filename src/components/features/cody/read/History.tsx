"use client";

import { BaseCody, GetAllCodyResponse } from "@/src/interfaces/cody.interface";
import React from "react";

const History = (props: {
  getHistory: (interaction: string) => Promise<void>;
}) => {
  const [history, setHistory] = React.useState<BaseCody[]>([]);

  const mappedHistory = history.map((h) => {
    return (
      <button
        onClick={() => props.getHistory(h.interaction)}
        className="w-full p-2 rounded-sm bg-neutral-700 text-secondary text-xs"
        key={h.id}
      >
        {h.name}
      </button>
    );
  });

  React.useEffect(() => {
    const getHistory = async () => {
      try {
        const response = await fetch(`/api/cody`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const resolve: GetAllCodyResponse = await response.json();

        if (!resolve.success) {
          throw new Error(resolve.message);
        }

        const { chats } = resolve.data;

        setHistory(chats);
      } catch (error) {
        console.log(error);
      }
    };

    getHistory();
  }, []);

  return (
    <div className="w-full flex flex-col items-start justify-start gap-2 absolute backdrop-blur-md bg-primary p-2 rounded-md top-8 shadow-sm animate-fade">
      {mappedHistory}
    </div>
  );
};

export default History;
