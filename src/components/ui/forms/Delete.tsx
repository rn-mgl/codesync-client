import { DeleteForm, DeleteResponse } from "@/src/interfaces/form.interface";
import React from "react";
import { FaXmark } from "react-icons/fa6";
import { toast } from "sonner";

const Delete = (props: DeleteForm) => {
  const handleDelete = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/${props.endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resolve: DeleteResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      toast(message);

      if (props.postDeleteAction) {
        props.postDeleteAction();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                left-0 z-30 backdrop-blur-md bg-linear-to-b from-primary/20 to-red-500/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-t) p-4">
        <div className="w-full rounded-t-lg bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Delete {props.label || "Record"}</h1>

          <button
            onClick={props.closeForm}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>
        <div className="w-full h-fit bg-secondary rounded-b-lg p-4">
          <form
            onSubmit={(e) => handleDelete(e)}
            className="flex flex-col items-center justify-start gap-2"
          >
            <p>
              Are you sure you want to delete this {props.label || "record"}?
            </p>

            <button
              type="submit"
              className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Delete;
