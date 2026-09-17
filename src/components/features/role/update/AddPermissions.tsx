"use client";

import ListLoader from "@/src/components/ui/loader/ListLoader";
import React from "react";
import { FaXmark } from "react-icons/fa6";

const AddPermissions = (props: { closeModal: () => void }) => {
  const [loading, setLoading] = React.useState(false);
  const [permissions, setPermissions] = React.useState([]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                      left-0 z-40 backdrop-blur-md bg-linear-to-b from-primary/20 to-accent/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-l-l) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Add Permission</h1>

          <button
            onClick={props.closeModal}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>

        <div className="w-full h-auto max-h-full bg-secondary rounded-lg p-4 flex flex-col items-start justify-start gap-4 overflow-y-auto">
          {loading ? (
            <ListLoader />
          ) : (
            <div className="w-full">
              <div></div>

              <button
                type="submit"
                className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2"
              >
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPermissions;
