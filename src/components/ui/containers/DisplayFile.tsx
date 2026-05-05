import { DisplayFileProps } from "@/src/interfaces/container.interface";
import Image from "next/image";
import React from "react";
import { FaFileImage } from "react-icons/fa6";

const DisplayFile = (props: DisplayFileProps) => {
  const rendered: Record<typeof props.type, React.ReactNode> = {
    image:
      props.src !== "" ? (
        <Image
          width={500}
          height={500}
          alt="File"
          src={props.src}
          className="w-6/12"
        />
      ) : (
        <FaFileImage className="text-2xl opacity-50" />
      ),
    app: <React.Fragment></React.Fragment>,
    audio: <React.Fragment></React.Fragment>,
    video: <React.Fragment></React.Fragment>,
  };

  return (
    <div className="w-full flex flex-col bg-neutral-200 p-2 rounded-lg items-center t:p-4">
      <div className="w-full flex flex-col gap-2 items-center justify-center  t:max-w-(--breakpoint-m-l)">
        <div
          className="p-2 rounded-md aspect-video w-full border-neutral-400 bg-secondary border-2 flex flex-col 
                              items-center justify-center bg-cover bg-center overflow-hidden"
        >
          {rendered[props.type]}
        </div>
      </div>
    </div>
  );
};

export default DisplayFile;
