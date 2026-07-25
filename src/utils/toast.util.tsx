import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { toast } from "sonner";

export const successToast = (message: string) => {
  toast(
    <span className="flex gap-2 items-center">
      <FaCircleCheck className="text-success shrink-0" />
      <span>{message}</span>
    </span>,
  );
};

export const errorToast = (message: string) => {
  toast(
    <span className="flex gap-2 items-center">
      <FaCircleExclamation className="text-danger shrink-0" />
      <span>{message}</span>
    </span>,
  );
};
