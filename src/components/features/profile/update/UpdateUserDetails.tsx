import File from "@/src/components/ui/fields/File";
import Input from "@/src/components/ui/fields/Input";
import useFile from "@/src/hooks/useFile";
import { UpdateForm } from "@/src/interfaces/form.interface";
import { UpdateUserResponse, UserForm } from "@/src/interfaces/user.interface";
import { getErrorMessage } from "@/src/utils/general.util";
import React from "react";
import { FaA, FaXmark } from "react-icons/fa6";
import { toast } from "sonner";

const UpdateUserDetails = (props: UpdateForm & { user: UserForm }) => {
  const [userDetails, setUserDetails] = React.useState<UserForm>({
    first_name: props.user.first_name,
    last_name: props.user.last_name,
    username: props.user.username,
    image: props.user.image,
  });

  const {
    fileRef,
    handleLocalFile,
    localFile,
    removeLocalFile,
    removeUploadedFile,
  } = useFile(setUserDetails);

  const handleUserDetails = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserDetails((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.set("first_name", userDetails.first_name);
      formData.set("last_name", userDetails.last_name);
      formData.set("username", userDetails.username);
      formData.set("image", userDetails.image ?? "");

      const response = await fetch(`/api/user`, {
        method: "PATCH",
        body: formData,
      });

      const resolve: UpdateUserResponse = await response.json();

      if (!resolve.success) {
        throw new Error(resolve.message);
      }

      const { message } = resolve.data;

      toast(message);

      if (props.postUpdateAction) {
        props.postUpdateAction();
      }

      props.closeForm();
    } catch (error) {
      console.log(error);
      const message = getErrorMessage(error);
      toast(message);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                  left-0 z-30 backdrop-blur-md bg-linear-to-b from-accent/20 to-success/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-t) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Update {props.label || "Record"}</h1>

          <button
            onClick={props.closeForm}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>
        <div className="w-full h-fit bg-secondary rounded-lg p-4">
          <form
            onSubmit={(e) => handleUpdate(e)}
            className="flex flex-col items-center justify-start gap-2"
          >
            <File
              name="image"
              id="image"
              file={
                localFile.file
                  ? localFile
                  : typeof userDetails.image === "string" &&
                      userDetails.image !== ""
                    ? userDetails.image
                    : ""
              }
              fileRef={fileRef}
              handleFile={handleLocalFile}
              removeFile={
                localFile.file
                  ? removeLocalFile
                  : () => removeUploadedFile("image")
              }
            />

            <Input
              id="first_name"
              name="first_name"
              onChange={handleUserDetails}
              type="text"
              value={userDetails.first_name}
              icon={<FaA />}
              label="First Name"
              placeholder="First Name"
              required={true}
            />

            <Input
              id="last_name"
              name="last_name"
              onChange={handleUserDetails}
              type="text"
              value={userDetails.last_name}
              icon={<FaA />}
              label="Last Name"
              placeholder="Last Name"
              required={true}
            />

            <Input
              id="username"
              name="username"
              onChange={handleUserDetails}
              type="text"
              value={userDetails.username}
              icon={<FaA />}
              label="Username"
              placeholder="Username"
              required={true}
            />

            <button
              type="submit"
              className="w-full p-2 rounded-md bg-primary text-secondary font-bold mt-2"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserDetails;
