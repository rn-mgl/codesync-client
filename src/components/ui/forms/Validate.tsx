import { ValidateForm, ValidateResponse } from "@/src/interfaces/form.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import { successToast, errorToast } from "@/src/utils/toast.util";
import React from "react";
import { FaXmark } from "react-icons/fa6";

const Validate = (props: ValidateForm) => {
  const [loading, setLoading] = React.useState(false);

  const handleValidate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const request = {
        action: "validate_record",
        record_type: props.endpoint,
        id: props.body.id,
      };

      const response = await fetch("/api/open-cody", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ request }),
      });

      const resolve: ValidateResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      successToast(message);

      if (props.postValidateAction) {
        props.postValidateAction();
      }
    } catch (error) {
      errorToast(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0
                left-0 z-40 backdrop-blur-md bg-linear-to-b from-primary/20 to-info/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-t) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Validate {props.label || "Record"}</h1>

          <button
            onClick={props.closeForm}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>
        <div className="w-full h-fit bg-secondary rounded-lg p-4">
          <form
            onSubmit={(e) => handleValidate(e)}
            className="flex flex-col items-center justify-start gap-2"
          >
            <p>
              Are you sure you want to validate this {props.label || "record"}?
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2 disabled:opacity-50"
            >
              {loading ? "Validating..." : "Validate"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Validate;
