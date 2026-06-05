"use client";
import Input from "@/src/components/ui/fields/Input";
import { BaseForm } from "@/src/interfaces/form.interface";
import React from "react";
import { FaEye, FaEyeSlash, FaXmark } from "react-icons/fa6";

const ChangePassword = (props: BaseForm) => {
  const [password, setPassword] = React.useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [showPassword, setShowPassword] = React.useState({
    current_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  const handleShowPassword = (name: string) => {
    setShowPassword((prev) => {
      return {
        ...prev,
        [name]: !prev[name as keyof typeof prev],
      };
    });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setPassword((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 
                  left-0 z-30 backdrop-blur-md bg-linear-to-b from-accent/20 to-success/20 animate-fade"
    >
      <div className="w-full h-full flex flex-col items-center justify-center max-w-(--breakpoint-t) p-4 gap-2">
        <div className="w-full rounded-lg capitalize bg-primary text-secondary font-bold flex items-center justify-between p-4">
          <h1>Change Password</h1>

          <button
            onClick={props.closeForm}
            className="p-2 rounded-full hover:bg-secondary/20"
          >
            <FaXmark />
          </button>
        </div>
        <div className="w-full h-fit bg-secondary rounded-lg p-4">
          <form
            // onSubmit={(e) => handleUpdate(e)}
            className="flex flex-col items-center justify-start gap-2"
          >
            <Input
              id="current_password"
              name="current_password"
              onChange={handlePassword}
              type={showPassword.current_password ? "text" : "password"}
              value={password.current_password}
              icon={
                showPassword.current_password ? (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("current_password")}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("current_password")}
                  />
                )
              }
              label="Current Password"
              placeholder="Current Password"
              required={true}
            />

            <Input
              id="new_password"
              name="new_password"
              onChange={handlePassword}
              type={showPassword.new_password ? "text" : "password"}
              value={password.new_password}
              icon={
                showPassword.new_password ? (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("new_password")}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("new_password")}
                  />
                )
              }
              label="New Password"
              placeholder="New Password"
              required={true}
            />

            <Input
              id="confirm_new_password"
              name="confirm_new_password"
              onChange={handlePassword}
              type={showPassword.confirm_new_password ? "text" : "password"}
              value={password.confirm_new_password}
              icon={
                showPassword.confirm_new_password ? (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("confirm_new_password")}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => handleShowPassword("confirm_new_password")}
                  />
                )
              }
              label="Confirm New Password"
              placeholder="Confirm New Password"
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

export default ChangePassword;
