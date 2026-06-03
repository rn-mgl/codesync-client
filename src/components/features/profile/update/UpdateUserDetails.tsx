import File from "@/src/components/ui/fields/File";
import Input from "@/src/components/ui/fields/Input";
import useFile from "@/src/hooks/useFile";
import { UpdateForm } from "@/src/interfaces/form.interface";
import { UserForm } from "@/src/interfaces/user.interface";
import React from "react";
import { FaA, FaXmark } from "react-icons/fa6";

const UpdateUserDetails = (props: UpdateForm & { user: UserForm }) => {
  const [userDetails, setUserDetails] = React.useState<UserForm>({
    first_name: props.user.first_name,
    last_name: props.user.last_name,
    username: props.user.username,
    image: null,
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

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                  left-0 z-30 backdrop-blur-md bg-linear-to-b from-accent/20 to-info/20 animate-fade"
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
            //   onSubmit={(e) => handleDelete(e)}
            className="flex flex-col items-center justify-start gap-2"
          >
            <File
              file={localFile}
              fileRef={fileRef}
              handleFile={handleLocalFile}
              removeFile={removeLocalFile}
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
